import type { Request, Response, Event, Frame, HelloOk } from './types';

type EventHandler = (event: Event) => void;
type ResponseResolver = { resolve: (res: Response) => void; reject: (err: Error) => void };

const DEFAULT_GATEWAY_URL = 'wss://vm-0-14-ubuntu.tailf58059.ts.net';
let gatewayUrl = DEFAULT_GATEWAY_URL;
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;

let ws: WebSocket | null = null;
let authToken: string | undefined;
let reqId = 0;
let reconnectAttempt = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let intentionalClose = false;

const pending = new Map<string, ResponseResolver>();
const eventHandlers = new Map<string, Set<EventHandler>>();

let connectionPromise: Promise<HelloOk> | null = null;
let connectionResolve: ((ok: HelloOk) => void) | null = null;
let connectionReject: ((err: Error) => void) | null = null;

function nextId(): string {
	return String(++reqId);
}

function handleMessage(data: string): void {
	let frame: Frame;
	try {
		frame = JSON.parse(data);
	} catch {
		return;
	}

	if (frame.type === 'event') {
		const handlers = eventHandlers.get(frame.event);
		if (handlers) {
			for (const handler of handlers) {
				handler(frame);
			}
		}
	} else if (frame.type === 'res') {
		const resolver = pending.get(frame.id);
		if (resolver) {
			pending.delete(frame.id);
			if (frame.ok) {
				resolver.resolve(frame);
			} else {
				resolver.reject(new Error(frame.error?.message ?? 'Request failed'));
			}
		}
	}
}

function scheduleReconnect(): void {
	if (intentionalClose) return;
	const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS);
	reconnectAttempt++;
	reconnectTimer = setTimeout(() => {
		connect();
	}, delay);
}

export function setGatewayUrl(url: string): void {
	gatewayUrl = url;
}

export function getGatewayUrl(): string {
	return gatewayUrl;
}

export function connect(url?: string): Promise<HelloOk> {
	if (url) gatewayUrl = url;

	if (connectionPromise && ws && ws.readyState === WebSocket.OPEN) {
		return connectionPromise;
	}

	intentionalClose = false;

	connectionPromise = new Promise<HelloOk>((resolve, reject) => {
		connectionResolve = resolve;
		connectionReject = reject;
	});

	ws = new WebSocket(gatewayUrl);

	ws.onopen = async () => {
		reconnectAttempt = 0;
		try {
			const params: Record<string, unknown> = {
				minProtocol: 3,
				maxProtocol: 3,
				client: {
					id: 'gateway-client',
					displayName: 'Clawless',
					version: '0.1.0',
					platform: 'tauri',
					mode: 'ui'
				},
				role: 'operator',
				scopes: ['operator.read', 'operator.write', 'chat']
			};
			if (authToken) {
				params.auth = { token: authToken };
			}
			const res = await send<HelloOk>('connect', params);
			connectionResolve?.(res);
		} catch (err) {
			connectionReject?.(err instanceof Error ? err : new Error(String(err)));
		}
	};

	ws.onmessage = (ev) => {
		handleMessage(typeof ev.data === 'string' ? ev.data : '');
	};

	ws.onclose = () => {
		for (const [, resolver] of pending) {
			resolver.reject(new Error('Connection closed'));
		}
		pending.clear();
		ws = null;
		connectionReject?.(new Error('Connection closed'));
		connectionResolve = null;
		connectionReject = null;
		scheduleReconnect();
	};

	ws.onerror = () => {
		// onclose will fire after this
	};

	return connectionPromise;
}

export function disconnect(): void {
	intentionalClose = true;
	if (reconnectTimer) clearTimeout(reconnectTimer);
	if (ws) {
		ws.close();
		ws = null;
	}
	connectionPromise = null;
}

export function send<T = Record<string, unknown>>(
	method: string,
	params: Record<string, unknown> = {}
): Promise<T> {
	return new Promise((resolve, reject) => {
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			reject(new Error('Not connected'));
			return;
		}

		const id = nextId();
		const req: Request = { type: 'req', id, method, params };

		pending.set(id, {
			resolve: (res) => resolve(res.payload as T),
			reject
		});

		ws.send(JSON.stringify(req));
	});
}

export function subscribe(event: string, handler: EventHandler): () => void {
	let handlers = eventHandlers.get(event);
	if (!handlers) {
		handlers = new Set();
		eventHandlers.set(event, handlers);
	}
	handlers.add(handler);

	return () => {
		handlers!.delete(handler);
		if (handlers!.size === 0) {
			eventHandlers.delete(event);
		}
	};
}

export function isConnected(): boolean {
	return ws !== null && ws.readyState === WebSocket.OPEN;
}

export function setAuthToken(t: string): void {
	authToken = t;
}

export function getAuthToken(): string | undefined {
	return authToken;
}

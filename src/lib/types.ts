// Protocol frame types

export interface Request {
	type: 'req';
	id: string;
	method: string;
	params: Record<string, unknown>;
}

export interface Response {
	type: 'res';
	id: string;
	ok: boolean;
	payload?: unknown;
	error?: {
		code: string;
		message: string;
		details?: unknown;
		retryable?: boolean;
	};
}

export interface Event {
	type: 'event';
	event: string;
	payload: Record<string, unknown>;
	seq: number;
}

export type Frame = Request | Response | Event;

// Connection types

export interface ConnectClientInfo {
	id: string;
	displayName: string;
	version: string;
	platform: string;
	mode: string;
}

export interface ConnectParams {
	minProtocol: number;
	maxProtocol: number;
	client: ConnectClientInfo;
	role: string;
	auth?: { token: string };
}

export interface HelloOk {
	protocol: number;
	server: { version: string; connId: string };
	snapshot?: Record<string, unknown>;
}

// Session types

export interface SessionEntry {
	sessionId: string;
	key: string;
	updatedAt: number;
	chatType?: 'direct' | 'group' | 'channel' | 'thread';
	channel?: string;
	displayName?: string;
	label?: string;
	inputTokens?: number;
	outputTokens?: number;
	totalTokens?: number;
	modelOverride?: string;
	lastMessage?: string;
}

// Chat types

export type ChatRole = 'user' | 'assistant' | 'tool' | 'system';

export type ContentBlock = { type: 'text'; text: string } | { type: string; [key: string]: unknown };

export interface ChatMessage {
	role: ChatRole;
	content: string | ContentBlock[];
	timestamp?: number;
	runId?: string;
	usage?: { inputTokens: number; outputTokens: number };
}

export function extractTextContent(content: string | ContentBlock[]): string {
	if (typeof content === 'string') return content;
	return content
		.filter((b): b is { type: 'text'; text: string } => b.type === 'text')
		.map((b) => b.text)
		.join('');
}

export type ChatEventState = 'delta' | 'final' | 'aborted' | 'error';

export interface ChatEvent {
	sessionKey: string;
	state: ChatEventState;
	runId?: string;
	content?: string;
	message?: ChatMessage;
	errorMessage?: string;
	usage?: { inputTokens: number; outputTokens: number };
}

// Agent management types

export interface AgentSummary {
	id: string;
	name?: string;
	default?: boolean;
	workspace?: string;
	model?: string;
	emoji?: string;
}

export interface AgentCreateParams {
	name: string;
	workspace?: string;
	emoji?: string;
}

export interface AgentUpdateParams {
	agentId: string;
	name?: string;
	workspace?: string;
	model?: string;
}

export interface AgentEvent {
	sessionKey: string;
	runId?: string;
	stream?: string;
	delta?: string;
	data?: { text?: string };
	phase?: string;
	type?: string;
	tool?: string;
	input?: unknown;
	output?: unknown;
}

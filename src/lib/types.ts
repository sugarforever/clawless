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
	payload: Record<string, unknown>;
	error?: string;
}

export interface Event {
	type: 'event';
	event: string;
	payload: Record<string, unknown>;
	seq: number;
}

export type Frame = Request | Response | Event;

// Connection types

export interface ConnectParams {
	client: string;
	version: string;
	capabilities?: string[];
}

export interface HelloOk {
	version: string;
	features: string[];
	snapshot?: Record<string, unknown>;
	token?: string;
}

// Session types

export interface SessionEntry {
	sessionId: string;
	sessionKey: string;
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

export interface ChatMessage {
	role: ChatRole;
	content: string;
	timestamp?: number;
	runId?: string;
	usage?: { inputTokens: number; outputTokens: number };
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

export interface AgentEvent {
	sessionKey: string;
	type: string;
	tool?: string;
	input?: unknown;
	output?: unknown;
}

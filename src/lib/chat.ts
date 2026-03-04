import { send, subscribe } from './gateway';
import type { ChatMessage, ChatEvent, AgentEvent, Event } from './types';

export async function loadHistory(
	sessionKey: string,
	limit = 200
): Promise<ChatMessage[]> {
	const result = await send<{ messages: ChatMessage[] }>('chat.history', {
		sessionKey,
		limit
	});
	return result.messages ?? [];
}

export async function sendMessage(
	sessionKey: string,
	message: string,
	options: { thinking?: 'low' | 'medium' | 'high'; attachments?: unknown[] } = {}
): Promise<void> {
	await send('chat.send', {
		sessionKey,
		message,
		idempotencyKey: crypto.randomUUID(),
		...options
	});
}

export async function abortRun(sessionKey: string, runId?: string): Promise<void> {
	await send('chat.abort', { sessionKey, runId });
}

export function subscribeToChatEvents(
	handler: (event: ChatEvent) => void
): () => void {
	return subscribe('chat', (ev: Event) => {
		handler(ev.payload as unknown as ChatEvent);
	});
}

export function subscribeToAgentEvents(
	handler: (event: AgentEvent) => void
): () => void {
	return subscribe('agent', (ev: Event) => {
		handler(ev.payload as unknown as AgentEvent);
	});
}

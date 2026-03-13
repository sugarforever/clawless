import { send } from './gateway';
import type { SessionEntry } from './types';

export interface SessionListParams {
	limit?: number;
	includeGlobal?: boolean;
	search?: string;
	includeLastMessage?: boolean;
}

export interface SessionPreviewParams {
	keys: string[];
	limit?: number;
	maxChars?: number;
}

export async function listSessions(params: SessionListParams = {}): Promise<SessionEntry[]> {
	const result = await send<{ sessions: SessionEntry[] }>('sessions.list', {
		includeGlobal: true,
		includeLastMessage: true,
		...params
	});
	return result.sessions ?? [];
}

export async function previewSessions(params: SessionPreviewParams): Promise<Record<string, string>> {
	const result = await send<{ previews: Record<string, string> }>('sessions.preview', params as unknown as Record<string, unknown>);
	return result.previews ?? {};
}

export function sortByUpdated(sessions: SessionEntry[]): SessionEntry[] {
	return [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function filterSessions(sessions: SessionEntry[], query: string): SessionEntry[] {
	if (!query.trim()) return sessions;
	const q = query.toLowerCase();
	return sessions.filter(
		(s) =>
			s.key.toLowerCase().includes(q) ||
			s.displayName?.toLowerCase().includes(q) ||
			s.label?.toLowerCase().includes(q) ||
			s.derivedTitle?.toLowerCase().includes(q) ||
			s.channel?.toLowerCase().includes(q) ||
			s.lastMessagePreview?.toLowerCase().includes(q) ||
			s.lastMessage?.toLowerCase().includes(q)
	);
}

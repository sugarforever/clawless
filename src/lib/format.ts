import type { SessionEntry, AgentSummary } from './types';

export function formatTime(ts: number): string {
	const d = new Date(ts);
	const now = new Date();
	if (d.toDateString() === now.toDateString()) {
		return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
	const diff = now.getTime() - d.getTime();
	if (diff < 7 * 86400000) {
		return d.toLocaleDateString([], { weekday: 'short' });
	}
	return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function displayLabel(s: SessionEntry): string {
	return s.derivedTitle || s.displayName || s.label || formatKey(s.key);
}

export function formatKey(key: string): string {
	if (key === 'main') return 'Main';
	const parts = key.split(':');
	if (parts.length >= 3) return parts.slice(-1)[0];
	return key;
}

export function parseAgentId(key: string): string | null {
	const match = key.match(/^agent:([^:]+)/);
	return match ? match[1] : null;
}

export { getChannelInfo, type ChannelInfo } from './channels';

export function agentInitials(agent: AgentSummary): string {
	const name = agent.name ?? agent.id;
	return name.slice(0, 2).toUpperCase();
}

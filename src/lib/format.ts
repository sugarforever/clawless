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
	return s.displayName || s.label || formatKey(s.key);
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

export interface ChannelBadge {
	label: string;
	className: string;
}

export function channelBadge(channel?: string): ChannelBadge {
	if (!channel) return { label: 'DM', className: 'bg-muted text-muted-foreground' };
	const c = channel.toLowerCase();
	if (c.includes('telegram')) return { label: 'TG', className: 'bg-sky-950 text-sky-400' };
	if (c.includes('discord')) return { label: 'DC', className: 'bg-indigo-950 text-indigo-400' };
	if (c.includes('slack')) return { label: 'SL', className: 'bg-emerald-950 text-emerald-400' };
	if (c.includes('whatsapp')) return { label: 'WA', className: 'bg-green-950 text-green-400' };
	if (c.includes('matrix')) return { label: 'MX', className: 'bg-purple-950 text-purple-400' };
	return { label: 'DM', className: 'bg-muted text-muted-foreground' };
}

export function agentInitials(agent: AgentSummary): string {
	const name = agent.name ?? agent.id;
	return name.slice(0, 2).toUpperCase();
}

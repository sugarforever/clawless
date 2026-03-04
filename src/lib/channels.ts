import type { SessionEntry } from './types';

/** Known messaging platform channels */
const MESSAGING_CHANNELS = ['telegram', 'discord', 'slack', 'whatsapp', 'matrix'] as const;
export type MessagingChannel = (typeof MESSAGING_CHANNELS)[number];

/** All possible channel group identifiers */
export type ChannelId = MessagingChannel | 'direct' | 'cron' | 'clawless';

/** Parsed session key components */
export interface ParsedSessionKey {
	agentId: string;
	channel: ChannelId;
	/** The rest segments after agent:{agentId}: */
	rest: string[];
}

/**
 * Parse a session key into structured components.
 *
 * Key structure: agent:{agentId}:{rest}
 * Rest patterns:
 *   main                                      → direct (main DM scope)
 *   direct:{peerId}                           → direct (per-peer DM)
 *   {channel}:direct:{peerId}                 → {channel} (per-channel-peer DM)
 *   {channel}:{accountId}:direct:{peerId}     → {channel} (per-account-channel-peer DM)
 *   {channel}:{peerKind}:{peerId}             → {channel} (group/channel)
 *   ...:thread:{threadId}                     → same channel as base
 *   cron:{uuid}                               → cron
 *   clawless:{id}                             → clawless
 *   ...subagent:...                           → inherit from parent
 */
export function parseSessionKey(key: string): ParsedSessionKey | null {
	const parts = key.split(':');
	if (parts[0] !== 'agent' || parts.length < 3) return null;

	const agentId = parts[1];
	const rest = parts.slice(2);
	const channel = resolveChannel(rest);

	return { agentId, channel, rest };
}

function resolveChannel(rest: string[]): ChannelId {
	const first = rest[0];

	if (first === 'main' || first === 'direct') return 'direct';
	if (first === 'cron') return 'cron';
	if (first === 'clawless') return 'clawless';

	if ((MESSAGING_CHANNELS as readonly string[]).includes(first)) {
		return first as MessagingChannel;
	}

	return 'direct';
}

/**
 * Determine channel group for a session.
 * Prefers explicit `session.channel` from gateway, falls back to key parsing.
 */
export function inferChannel(session: SessionEntry): ChannelId {
	if (session.channel) {
		const c = session.channel.toLowerCase();
		for (const ch of MESSAGING_CHANNELS) {
			if (c.includes(ch)) return ch;
		}
	}

	const parsed = parseSessionKey(session.key);
	return parsed?.channel ?? 'direct';
}

/** Channel display metadata */
export interface ChannelInfo {
	id: ChannelId;
	displayName: string;
	label: string;
	className: string;
	icon?: 'slack' | 'whatsapp' | 'telegram' | 'discord';
}

const CHANNEL_INFO: Record<string, ChannelInfo> = {
	telegram: { id: 'telegram', displayName: 'Telegram', label: 'TG', className: 'bg-sky-950 text-sky-400', icon: 'telegram' },
	discord: { id: 'discord', displayName: 'Discord', label: 'DC', className: 'bg-indigo-950 text-indigo-400', icon: 'discord' },
	slack: { id: 'slack', displayName: 'Slack', label: 'SL', className: 'bg-emerald-950 text-emerald-400', icon: 'slack' },
	whatsapp: { id: 'whatsapp', displayName: 'WhatsApp', label: 'WA', className: 'bg-green-950 text-green-400', icon: 'whatsapp' },
	matrix: { id: 'matrix', displayName: 'Matrix', label: 'MX', className: 'bg-purple-950 text-purple-400' },
	cron: { id: 'cron', displayName: 'Cron', label: 'CR', className: 'bg-orange-950 text-orange-400' },
	clawless: { id: 'clawless', displayName: 'Clawless', label: 'CL', className: 'bg-violet-950 text-violet-400' },
	direct: { id: 'direct', displayName: 'Direct', label: 'DM', className: 'bg-muted text-muted-foreground' },
};

export function getChannelInfo(channelId: string): ChannelInfo {
	return CHANNEL_INFO[channelId] ?? CHANNEL_INFO.direct;
}

/** Group sessions by channel */
export interface ChannelGroup {
	channel: ChannelId;
	info: ChannelInfo;
	sessions: SessionEntry[];
}

export function groupSessionsByChannel(sessions: SessionEntry[]): ChannelGroup[] {
	const map = new Map<string, SessionEntry[]>();
	for (const s of sessions) {
		const ch = inferChannel(s);
		if (!map.has(ch)) map.set(ch, []);
		map.get(ch)!.push(s);
	}

	return Array.from(map.entries())
		.map(([channel, sessions]) => ({
			channel: channel as ChannelId,
			info: getChannelInfo(channel),
			sessions,
		}))
		.sort((a, b) => b.sessions[0].updatedAt - a.sessions[0].updatedAt);
}

<script lang="ts">
	import type { SessionEntry } from '$lib/types';
	import { filterSessions } from '$lib/sessions';
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';

	let { sessions = [] }: { sessions: SessionEntry[] } = $props();

	let search = $state('');
	let filtered = $derived(filterSessions(sessions, search));

	let activeKey = $derived(
		$page.params.key ? decodeURIComponent($page.params.key) : null
	);

	function formatTime(ts: number): string {
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

	function displayLabel(s: SessionEntry): string {
		return s.displayName || s.label || formatKey(s.sessionKey);
	}

	function formatKey(key: string): string {
		if (key === 'main') return 'Main';
		const parts = key.split(':');
		if (parts.length >= 3) return parts.slice(-1)[0];
		return key;
	}

	function channelIcon(channel?: string): string {
		if (!channel) return '💬';
		const c = channel.toLowerCase();
		if (c.includes('telegram')) return '✈️';
		if (c.includes('discord')) return '🎮';
		if (c.includes('slack')) return '📋';
		if (c.includes('whatsapp')) return '📱';
		if (c.includes('matrix')) return '🔗';
		return '💬';
	}
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<div class="px-3 py-2">
		<div class="relative">
			<svg
				class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
			<input
				type="text"
				placeholder="Search sessions..."
				bind:value={search}
				class="w-full rounded-md bg-sidebar-muted py-1.5 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground outline-none ring-ring focus:ring-1"
			/>
		</div>
	</div>

	<nav class="flex-1 overflow-y-auto px-2">
		{#each filtered as session (session.sessionKey)}
			{@const active = session.sessionKey === activeKey}
			<a
				href="/chat/{encodeURIComponent(session.sessionKey)}"
				class={cn(
					'group flex gap-3 rounded-lg px-3 py-2.5 transition-colors',
					active
						? 'bg-sidebar-accent text-sidebar-foreground'
						: 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
				)}
			>
				<span class="mt-0.5 text-sm">{channelIcon(session.channel)}</span>
				<div class="flex flex-1 flex-col gap-0.5 overflow-hidden">
					<div class="flex items-center justify-between gap-2">
						<span class={cn('truncate text-sm font-medium', active && 'text-foreground')}>
							{displayLabel(session)}
						</span>
						<span class="shrink-0 text-[11px] tabular-nums text-muted-foreground">
							{formatTime(session.updatedAt)}
						</span>
					</div>
					{#if session.lastMessage}
						<p class="truncate text-xs text-muted-foreground">
							{session.lastMessage}
						</p>
					{/if}
				</div>
			</a>
		{/each}

		{#if filtered.length === 0}
			<div class="px-3 py-8 text-center text-sm text-muted-foreground">
				{sessions.length === 0 ? 'No sessions yet' : 'No matches'}
			</div>
		{/if}
	</nav>
</div>

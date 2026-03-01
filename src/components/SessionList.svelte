<script lang="ts">
	import type { SessionEntry } from '$lib/types';
	import { filterSessions } from '$lib/sessions';

	let { sessions = [] }: { sessions: SessionEntry[] } = $props();

	let search = $state('');
	let filtered = $derived(filterSessions(sessions, search));

	function formatTime(ts: number): string {
		const d = new Date(ts);
		const now = new Date();
		if (d.toDateString() === now.toDateString()) {
			return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		}
		return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
	}

	function displayLabel(s: SessionEntry): string {
		return s.displayName || s.label || s.sessionKey;
	}
</script>

<div class="flex flex-col overflow-hidden flex-1">
	<div class="px-3 py-2">
		<input
			type="text"
			placeholder="Search sessions..."
			bind:value={search}
			class="w-full rounded bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:ring-1 focus:ring-zinc-600"
		/>
	</div>

	<nav class="flex-1 overflow-y-auto">
		{#each filtered as session (session.sessionKey)}
			<a
				href="/chat/{encodeURIComponent(session.sessionKey)}"
				class="flex flex-col gap-0.5 border-b border-zinc-800/50 px-4 py-2.5 hover:bg-zinc-800/50 transition-colors"
			>
				<div class="flex items-center justify-between">
					<span class="truncate text-sm font-medium text-zinc-200">
						{displayLabel(session)}
					</span>
					<span class="shrink-0 text-xs text-zinc-500">
						{formatTime(session.updatedAt)}
					</span>
				</div>
				{#if session.channel}
					<span class="text-xs text-zinc-500">{session.channel}</span>
				{/if}
				{#if session.lastMessage}
					<p class="truncate text-xs text-zinc-400">{session.lastMessage}</p>
				{/if}
			</a>
		{/each}

		{#if filtered.length === 0}
			<div class="px-4 py-6 text-center text-xs text-zinc-500">
				{sessions.length === 0 ? 'No sessions' : 'No matching sessions'}
			</div>
		{/if}
	</nav>
</div>

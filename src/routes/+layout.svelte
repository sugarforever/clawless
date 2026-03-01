<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { connect, disconnect, isConnected, getGatewayUrl } from '$lib/gateway';
	import { listSessions, sortByUpdated } from '$lib/sessions';
	import SessionList from '../components/SessionList.svelte';
	import type { SessionEntry } from '$lib/types';

	let { children } = $props();

	let sessions = $state<SessionEntry[]>([]);
	let connected = $state(false);
	let error = $state('');
	let showSettings = $state(false);
	let urlInput = $state(getGatewayUrl());

	onMount(() => {
		connectToGateway();
		return () => disconnect();
	});

	async function connectToGateway(url?: string) {
		connected = false;
		error = '';
		try {
			await connect(url);
			connected = true;
			const result = await listSessions();
			sessions = sortByUpdated(result);
			showSettings = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Connection failed';
		}
	}

	async function refresh() {
		if (!isConnected()) return;
		const result = await listSessions();
		sessions = sortByUpdated(result);
	}

	function handleConnect() {
		const url = urlInput.trim();
		if (!url) return;
		disconnect();
		connectToGateway(url);
	}
</script>

<div class="flex h-screen bg-background text-foreground">
	<aside class="flex w-72 flex-col border-r border-border bg-sidebar">
		<div class="flex h-14 items-center justify-between border-b border-border px-4">
			<h1 class="text-base font-semibold tracking-tight">Clawless</h1>
			<div class="flex items-center gap-2">
				<button
					onclick={() => (showSettings = !showSettings)}
					class="group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
					title={connected ? 'Connected' : 'Disconnected'}
				>
					<span
						class="h-1.5 w-1.5 rounded-full {connected ? 'bg-emerald-500' : 'bg-red-500'}"
					></span>
					<span class="hidden group-hover:inline">
						{connected ? 'Connected' : 'Offline'}
					</span>
				</button>
				<button
					onclick={refresh}
					class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
					title="Refresh sessions"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
						<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
						<path d="M3 3v5h5" />
						<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
						<path d="M16 16h5v5" />
					</svg>
				</button>
			</div>
		</div>

		{#if showSettings}
			<div class="border-b border-border px-3 py-3">
				<label for="gateway-url" class="mb-1.5 block text-xs font-medium text-muted-foreground">Gateway URL</label>
				<div class="flex gap-1.5">
					<input
						id="gateway-url"
						type="text"
						bind:value={urlInput}
						placeholder="ws://host:18789"
						class="flex-1 rounded-md border border-border bg-sidebar-muted px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1"
						onkeydown={(e) => e.key === 'Enter' && handleConnect()}
					/>
					<button
						onclick={handleConnect}
						class="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Connect
					</button>
				</div>
			</div>
		{/if}

		{#if error}
			<div class="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
				{error}
			</div>
		{/if}

		<SessionList {sessions} />
	</aside>

	<main class="flex flex-1 flex-col overflow-hidden">
		{@render children()}
	</main>
</div>

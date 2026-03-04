<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { connect, disconnect, isConnected, getGatewayUrl, setAuthToken } from '$lib/gateway';
	import { listSessions, sortByUpdated } from '$lib/sessions';
	import SessionList from '../components/SessionList.svelte';
	import type { SessionEntry } from '$lib/types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { children } = $props();

	let sessions = $state<SessionEntry[]>([]);
	let connected = $state(false);
	let error = $state('');
	let showSettings = $state(false);
	let urlInput = $state(localStorage.getItem('clawless:gateway-url') || getGatewayUrl());
	let tokenInput = $state(localStorage.getItem('clawless:auth-token') || '');

	let onAgentsPage = $derived($page.url.pathname.startsWith('/agents'));

	onMount(() => {
		const savedToken = localStorage.getItem('clawless:auth-token');
		if (savedToken) setAuthToken(savedToken);
		const savedUrl = localStorage.getItem('clawless:gateway-url');
		connectToGateway(savedUrl || undefined);
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
		const token = tokenInput.trim();
		localStorage.setItem('clawless:gateway-url', url);
		if (token) {
			localStorage.setItem('clawless:auth-token', token);
			setAuthToken(token);
		}
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

		<div class="flex border-b border-border">
			<a
				href="/"
				class="flex-1 py-2 text-center text-xs font-medium transition-colors {onAgentsPage ? 'text-muted-foreground hover:text-foreground' : 'border-b-2 border-primary text-foreground'}"
			>
				Sessions
			</a>
			<a
				href="/agents"
				class="flex-1 py-2 text-center text-xs font-medium transition-colors {onAgentsPage ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground hover:text-foreground'}"
			>
				Agents
			</a>
		</div>

		{#if showSettings}
			<div class="border-b border-border px-3 py-3">
				<label for="gateway-url" class="mb-1.5 block text-xs font-medium text-muted-foreground">Gateway URL</label>
				<input
					id="gateway-url"
					type="text"
					bind:value={urlInput}
					placeholder="wss://host:18789"
					class="w-full rounded-md border border-border bg-sidebar-muted px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1"
					onkeydown={(e) => e.key === 'Enter' && handleConnect()}
				/>
				<label for="gateway-token" class="mb-1.5 mt-2 block text-xs font-medium text-muted-foreground">Auth Token</label>
				<input
					id="gateway-token"
					type="password"
					bind:value={tokenInput}
					placeholder="Paste gateway token"
					class="w-full rounded-md border border-border bg-sidebar-muted px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1"
					onkeydown={(e) => e.key === 'Enter' && handleConnect()}
				/>
				<button
					onclick={handleConnect}
					class="mt-2 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Connect
				</button>
			</div>
		{/if}

		{#if error}
			<div class="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
				{error}
			</div>
		{/if}

		{#if !onAgentsPage}
			<div class="px-3 py-2">
				<button
					onclick={() => goto(`/chat/${encodeURIComponent('clawless:' + crypto.randomUUID().slice(0, 8))}`)}
					class="flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
						<path d="M12 5v14" /><path d="M5 12h14" />
					</svg>
					New Session
				</button>
			</div>
			<SessionList {sessions} />
		{/if}
	</aside>

	<main class="flex flex-1 flex-col overflow-hidden">
		{@render children()}
	</main>
</div>

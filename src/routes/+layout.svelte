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

<div class="flex h-screen bg-zinc-950 text-zinc-100">
	<aside class="flex w-72 flex-col border-r border-zinc-800 bg-zinc-900">
		<div class="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
			<h1 class="text-lg font-semibold">Clawless</h1>
			<div class="flex items-center gap-2">
				<button
					onclick={() => (showSettings = !showSettings)}
					class="h-2 w-2 rounded-full {connected ? 'bg-green-500' : 'bg-red-500'}"
					title={connected ? 'Connected' : 'Disconnected — click to configure'}
				></button>
				<button onclick={refresh} class="text-xs text-zinc-400 hover:text-zinc-200">
					Refresh
				</button>
			</div>
		</div>

		{#if showSettings}
			<div class="border-b border-zinc-800 px-3 py-2">
				<label class="mb-1 block text-xs text-zinc-400">Gateway URL</label>
				<div class="flex gap-1.5">
					<input
						type="text"
						bind:value={urlInput}
						placeholder="ws://host:18789"
						class="flex-1 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200 outline-none focus:ring-1 focus:ring-zinc-600"
						onkeydown={(e) => e.key === 'Enter' && handleConnect()}
					/>
					<button
						onclick={handleConnect}
						class="shrink-0 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-500"
					>
						Connect
					</button>
				</div>
			</div>
		{/if}

		{#if error}
			<div class="px-4 py-2 text-xs text-red-400">{error}</div>
		{/if}
		<SessionList {sessions} />
	</aside>

	<main class="flex flex-1 flex-col overflow-hidden">
		{@render children()}
	</main>
</div>

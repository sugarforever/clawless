<script lang="ts">
	import { onMount } from 'svelte';
	import { listAgents, deleteAgent } from '$lib/agents';
	import type { AgentSummary } from '$lib/types';
	import AgentEditor from '../../components/AgentEditor.svelte';

	let agents = $state<AgentSummary[]>([]);
	let loading = $state(true);
	let error = $state('');
	let editorAgent = $state<AgentSummary | null>(null);
	let showEditor = $state(false);
	let confirmDeleteId = $state<string | null>(null);

	onMount(() => {
		refresh();
	});

	async function refresh() {
		loading = true;
		error = '';
		try {
			agents = await listAgents();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load agents';
		} finally {
			loading = false;
		}
	}

	function openCreate() {
		editorAgent = null;
		showEditor = true;
	}

	function openEdit(agent: AgentSummary) {
		editorAgent = agent;
		showEditor = true;
	}

	function closeEditor() {
		showEditor = false;
		editorAgent = null;
	}

	async function handleEditorSave() {
		closeEditor();
		await refresh();
	}

	async function handleDelete(agentId: string) {
		if (confirmDeleteId !== agentId) {
			confirmDeleteId = agentId;
			return;
		}
		confirmDeleteId = null;
		try {
			await deleteAgent(agentId);
			await refresh();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete agent';
		}
	}

	let sorted = $derived(
		[...agents].sort((a, b) => {
			if (a.default) return -1;
			if (b.default) return 1;
			return (a.name ?? a.id).localeCompare(b.name ?? b.id);
		})
	);
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<div class="flex h-14 items-center justify-between border-b border-border px-6">
		<h1 class="text-base font-semibold">Agents</h1>
		<button
			onclick={openCreate}
			class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
		>
			New Agent
		</button>
	</div>

	{#if error}
		<div class="border-b border-destructive/30 bg-destructive/10 px-6 py-2 text-xs text-destructive">
			{error}
		</div>
	{/if}

	<div class="flex-1 overflow-y-auto p-6">
		{#if loading}
			<div class="py-12 text-center text-sm text-muted-foreground">Loading agents...</div>
		{:else if sorted.length === 0}
			<div class="py-12 text-center text-sm text-muted-foreground">No agents found</div>
		{:else}
			<div class="grid gap-3">
				{#each sorted as agent (agent.id)}
					<div class="flex items-center gap-4 rounded-lg border border-border p-4">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-lg">
							{agent.emoji ?? '🤖'}
						</div>
						<div class="flex flex-1 flex-col gap-0.5 overflow-hidden">
							<div class="flex items-center gap-2">
								<span class="truncate text-sm font-medium">{agent.name ?? agent.id}</span>
								{#if agent.default}
									<span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
										default
									</span>
								{/if}
							</div>
							<div class="flex gap-3 text-xs text-muted-foreground">
								<span>ID: {agent.id}</span>
								{#if agent.workspace}
									<span class="truncate">workspace: {agent.workspace}</span>
								{/if}
								{#if agent.model}
									<span>{agent.model}</span>
								{/if}
							</div>
						</div>
						<div class="flex shrink-0 items-center gap-1">
							<button
								onclick={() => openEdit(agent)}
								class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
								title="Edit"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
									<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
								</svg>
							</button>
							{#if !agent.default}
								<button
									onclick={() => handleDelete(agent.id)}
									class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
									title={confirmDeleteId === agent.id ? 'Click again to confirm' : 'Delete'}
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
										<path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
									</svg>
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

{#if showEditor}
	<AgentEditor agent={editorAgent} onclose={closeEditor} onsave={handleEditorSave} />
{/if}

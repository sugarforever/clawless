<script lang="ts">
	import type { AgentSummary } from '$lib/types';
	import { createAgent, updateAgent } from '$lib/agents';

	let {
		agent = null,
		onclose,
		onsave
	}: {
		agent: AgentSummary | null;
		onclose: () => void;
		onsave: () => void;
	} = $props();

	let editing = $derived(agent !== null);
	let initialName = $derived(agent?.name ?? '');
	let initialWorkspace = $derived(agent?.workspace ?? '');
	let initialModel = $derived(agent?.model ?? '');
	let name = $state('');
	let workspace = $state('');
	let model = $state('');

	$effect(() => {
		name = initialName;
		workspace = initialWorkspace;
		model = initialModel;
	});
	let saving = $state(false);
	let error = $state('');

	async function handleSave() {
		if (!name.trim()) {
			error = 'Name is required';
			return;
		}
		saving = true;
		error = '';
		try {
			if (editing && agent) {
				await updateAgent({
					agentId: agent.id,
					name: name.trim(),
					workspace: workspace.trim() || undefined,
					model: model.trim() || undefined
				});
			} else {
				await createAgent({
					name: name.trim(),
					workspace: workspace.trim() || undefined
				});
			}
			onsave();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save';
		} finally {
			saving = false;
		}
	}
</script>

<div class="fixed inset-0 z-50 flex justify-end" role="dialog">
	<button class="absolute inset-0 bg-black/40" onclick={onclose} aria-label="Close overlay"></button>
	<div class="relative flex w-96 flex-col bg-background shadow-xl">
		<div class="flex h-14 items-center justify-between border-b border-border px-4">
			<h2 class="text-sm font-semibold">{editing ? 'Edit Agent' : 'New Agent'}</h2>
			<button
				onclick={onclose}
				class="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
				aria-label="Close"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
					<path d="M18 6 6 18" /><path d="m6 6 12 12" />
				</svg>
			</button>
		</div>

		<div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
			{#if error}
				<div class="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
			{/if}

			<div>
				<label for="agent-name" class="mb-1.5 block text-xs font-medium text-muted-foreground">Name</label>
				<input
					id="agent-name"
					type="text"
					bind:value={name}
					placeholder="My Agent"
					class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-1"
				/>
			</div>

			<div>
				<label for="agent-workspace" class="mb-1.5 block text-xs font-medium text-muted-foreground">Workspace</label>
				<input
					id="agent-workspace"
					type="text"
					bind:value={workspace}
					placeholder="/path/to/workspace"
					class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-1"
				/>
			</div>

			{#if editing}
				<div>
					<label for="agent-model" class="mb-1.5 block text-xs font-medium text-muted-foreground">Model</label>
					<input
						id="agent-model"
						type="text"
						bind:value={model}
						placeholder="e.g. claude-sonnet-4-6"
						class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-1"
					/>
				</div>
			{/if}
		</div>

		<div class="flex gap-2 border-t border-border p-4">
			<button
				onclick={onclose}
				class="flex-1 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
			>
				Cancel
			</button>
			<button
				onclick={handleSave}
				disabled={saving}
				class="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
			>
				{saving ? 'Saving...' : 'Save'}
			</button>
		</div>
	</div>
</div>

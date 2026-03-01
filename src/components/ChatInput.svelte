<script lang="ts">
	let { onSend, onAbort, isStreaming = false }: {
		onSend: (message: string) => void;
		onAbort: () => void;
		isStreaming: boolean;
	} = $props();

	let input = $state('');

	function handleSubmit() {
		const trimmed = input.trim();
		if (!trimmed) return;
		onSend(trimmed);
		input = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}
</script>

<div class="border-t border-zinc-800 px-4 py-3">
	<div class="flex gap-2">
		<textarea
			bind:value={input}
			onkeydown={handleKeydown}
			placeholder="Type a message..."
			rows="1"
			class="flex-1 resize-none rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:ring-1 focus:ring-zinc-600"
		></textarea>
		{#if isStreaming}
			<button
				onclick={onAbort}
				class="shrink-0 rounded-lg bg-red-900/50 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-900/70"
			>
				Stop
			</button>
		{:else}
			<button
				onclick={handleSubmit}
				disabled={!input.trim()}
				class="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
			>
				Send
			</button>
		{/if}
	</div>
</div>

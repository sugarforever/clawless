<script lang="ts">
	let {
		onSend,
		onAbort,
		isStreaming = false
	}: {
		onSend: (message: string) => void;
		onAbort: () => void;
		isStreaming: boolean;
	} = $props();

	let input = $state('');
	let textarea: HTMLTextAreaElement;

	function handleSubmit() {
		const trimmed = input.trim();
		if (!trimmed) return;
		onSend(trimmed);
		input = '';
		requestAnimationFrame(() => autoResize());
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	function autoResize() {
		if (!textarea) return;
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
	}
</script>

<div class="border-t border-border bg-background px-4 py-3">
	<div class="mx-auto flex max-w-3xl items-end gap-2">
		<div class="relative flex-1">
			<textarea
				bind:this={textarea}
				bind:value={input}
				oninput={autoResize}
				onkeydown={handleKeydown}
				placeholder="Send a message..."
				rows="1"
				class="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder-muted-foreground outline-none ring-ring transition-colors focus:border-ring focus:ring-1"
			></textarea>
		</div>

		{#if isStreaming}
			<button
				onclick={onAbort}
				class="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground transition-colors hover:bg-destructive/80"
				title="Stop generating"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
					<rect x="6" y="6" width="12" height="12" rx="1" />
				</svg>
			</button>
		{:else}
			<button
				onclick={handleSubmit}
				disabled={!input.trim()}
				class="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed"
				title="Send message"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
					<path d="m5 12 7-7 7 7" />
					<path d="M12 19V5" />
				</svg>
			</button>
		{/if}
	</div>
</div>

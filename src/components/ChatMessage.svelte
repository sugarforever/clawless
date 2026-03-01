<script lang="ts">
	import type { ChatMessage } from '$lib/types';

	let { message }: { message: ChatMessage } = $props();

	let isUser = $derived(message.role === 'user');
	let roleLabel = $derived(
		message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Assistant' : message.role
	);
</script>

<div class="mb-3">
	<div class="text-xs font-medium {isUser ? 'text-blue-400' : 'text-zinc-500'} mb-1">
		{roleLabel}
	</div>
	<div
		class="rounded-lg px-3 py-2 text-sm {isUser
			? 'bg-blue-950/50 text-blue-100'
			: 'bg-zinc-800 text-zinc-200'}"
	>
		<div class="whitespace-pre-wrap break-words">{message.content}</div>
	</div>
	{#if message.usage}
		<div class="mt-0.5 text-xs text-zinc-600">
			{message.usage.inputTokens}in / {message.usage.outputTokens}out
		</div>
	{/if}
</div>

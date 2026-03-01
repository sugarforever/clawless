<script lang="ts">
	import type { ChatMessage } from '$lib/types';
	import { cn } from '$lib/utils';

	let { message }: { message: ChatMessage } = $props();

	let isUser = $derived(message.role === 'user');
	let isTool = $derived(message.role === 'tool');
</script>

<div class={cn('group mb-4 flex gap-3', isUser && 'flex-row-reverse')}>
	<div
		class={cn(
			'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
			isUser
				? 'bg-user-bubble text-user-bubble-foreground'
				: isTool
					? 'bg-amber-950/60 text-amber-400'
					: 'bg-muted text-muted-foreground'
		)}
	>
		{#if isUser}Y{:else if isTool}T{:else}A{/if}
	</div>

	<div class={cn('flex max-w-[75%] flex-col gap-1', isUser && 'items-end')}>
		<div
			class={cn(
				'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
				isUser
					? 'rounded-br-md bg-user-bubble text-user-bubble-foreground'
					: isTool
						? 'rounded-bl-md bg-amber-950/30 font-mono text-xs text-amber-200/80'
						: 'rounded-bl-md bg-card text-card-foreground'
			)}
		>
			<div class="whitespace-pre-wrap break-words">{message.content}</div>
		</div>

		{#if message.usage}
			<span class="px-1 text-[11px] tabular-nums text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
				{message.usage.inputTokens.toLocaleString()} in / {message.usage.outputTokens.toLocaleString()} out
			</span>
		{/if}
	</div>
</div>

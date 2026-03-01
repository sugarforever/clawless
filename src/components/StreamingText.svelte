<script lang="ts">
	let { content = '' }: { content: string } = $props();
</script>

<span class="whitespace-pre-wrap break-words">{content}<span class="inline-block h-4 w-1 animate-pulse bg-zinc-400 align-text-bottom"></span></span>

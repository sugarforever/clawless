<script lang="ts">
	let { content = '' }: { content: string } = $props();
</script>

<span class="whitespace-pre-wrap break-words">{content}<span
	class="ml-0.5 inline-block h-[1.1em] w-[3px] translate-y-[2px] animate-pulse rounded-sm bg-foreground/60"
></span></span>

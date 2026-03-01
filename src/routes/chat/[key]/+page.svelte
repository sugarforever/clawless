<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { loadHistory, sendMessage, abortRun, subscribeToChatEvents } from '$lib/chat';
	import type { ChatMessage, ChatEvent } from '$lib/types';
	import ChatMessageComponent from '../../../components/ChatMessage.svelte';
	import ChatInput from '../../../components/ChatInput.svelte';
	import StreamingText from '../../../components/StreamingText.svelte';

	let messages = $state<ChatMessage[]>([]);
	let streamingContent = $state('');
	let isStreaming = $state(false);
	let currentRunId = $state<string | undefined>();
	let error = $state('');
	let messagesEnd: HTMLDivElement;

	let sessionKey = $derived(decodeURIComponent($page.params.key ?? ''));

	let unsubscribe: (() => void) | undefined;

	onMount(() => {
		loadChat();
		unsubscribe = subscribeToChatEvents(handleChatEvent);
	});

	onDestroy(() => {
		unsubscribe?.();
	});

	async function loadChat() {
		error = '';
		messages = [];
		streamingContent = '';
		isStreaming = false;
		try {
			messages = await loadHistory(sessionKey);
			scrollToBottom();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load history';
		}
	}

	function handleChatEvent(event: ChatEvent) {
		if (event.sessionKey !== sessionKey) return;

		switch (event.state) {
			case 'delta':
				isStreaming = true;
				currentRunId = event.runId;
				streamingContent += event.content ?? '';
				scrollToBottom();
				break;
			case 'final':
				if (event.message) {
					messages = [...messages, event.message];
				} else if (streamingContent) {
					messages = [
						...messages,
						{ role: 'assistant', content: streamingContent, usage: event.usage }
					];
				}
				streamingContent = '';
				isStreaming = false;
				currentRunId = undefined;
				scrollToBottom();
				break;
			case 'aborted':
				if (streamingContent) {
					messages = [...messages, { role: 'assistant', content: streamingContent }];
				}
				streamingContent = '';
				isStreaming = false;
				currentRunId = undefined;
				break;
			case 'error':
				error = event.errorMessage ?? 'Unknown error';
				streamingContent = '';
				isStreaming = false;
				currentRunId = undefined;
				break;
		}
	}

	async function handleSend(message: string) {
		messages = [...messages, { role: 'user', content: message }];
		error = '';
		scrollToBottom();
		try {
			await sendMessage(sessionKey, message);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to send';
		}
	}

	async function handleAbort() {
		try {
			await abortRun(sessionKey, currentRunId);
		} catch {
			// ignore abort errors
		}
	}

	function scrollToBottom() {
		requestAnimationFrame(() => {
			messagesEnd?.scrollIntoView({ behavior: 'smooth' });
		});
	}

	$effect(() => {
		sessionKey;
		loadChat();
	});
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<header class="flex h-14 items-center border-b border-border px-6">
		<h2 class="truncate text-sm font-medium text-foreground">{sessionKey}</h2>
	</header>

	{#if error}
		<div class="border-b border-destructive/30 bg-destructive/10 px-6 py-2 text-xs text-destructive">
			{error}
		</div>
	{/if}

	<div class="flex-1 overflow-y-auto">
		<div class="mx-auto max-w-3xl px-6 py-6">
			{#each messages as msg}
				<ChatMessageComponent message={msg} />
			{/each}

			{#if isStreaming && streamingContent}
				<div class="group mb-4 flex gap-3">
					<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
						A
					</div>
					<div class="flex max-w-[75%] flex-col">
						<div class="rounded-2xl rounded-bl-md bg-card px-4 py-2.5 text-sm leading-relaxed text-card-foreground">
							<StreamingText content={streamingContent} />
						</div>
					</div>
				</div>
			{/if}

			<div bind:this={messagesEnd}></div>
		</div>
	</div>

	<ChatInput onSend={handleSend} onAbort={handleAbort} {isStreaming} />
</div>

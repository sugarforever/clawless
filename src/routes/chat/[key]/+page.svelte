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

	// Reload when session key changes
	$effect(() => {
		sessionKey; // track dependency
		loadChat();
	});
</script>

<div class="flex flex-1 flex-col overflow-hidden">
	<header class="border-b border-zinc-800 px-4 py-3">
		<h2 class="truncate text-sm font-medium text-zinc-300">{sessionKey}</h2>
	</header>

	{#if error}
		<div class="px-4 py-2 text-xs text-red-400">{error}</div>
	{/if}

	<div class="flex-1 overflow-y-auto px-4 py-4">
		{#each messages as msg}
			<ChatMessageComponent message={msg} />
		{/each}

		{#if isStreaming && streamingContent}
			<div class="mb-3">
				<div class="text-xs font-medium text-zinc-500 mb-1">Assistant</div>
				<div class="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200">
					<StreamingText content={streamingContent} />
				</div>
			</div>
		{/if}

		<div bind:this={messagesEnd}></div>
	</div>

	<ChatInput onSend={handleSend} onAbort={handleAbort} {isStreaming} />
</div>

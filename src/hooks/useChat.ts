import { useState, useEffect, useRef, useCallback } from 'react';
import { loadHistory, sendMessage, abortRun, subscribeToChatEvents, subscribeToAgentEvents } from '$lib/chat';
import type { ChatMessage, ChatEvent, AgentEvent } from '$lib/types';

export function useChat(sessionKey: string) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [streamingContent, setStreamingContent] = useState<string>('');
	const [isStreaming, setIsStreaming] = useState(false);
	const [error, setError] = useState('');
	const currentRunIdRef = useRef<string | undefined>(undefined);
	const streamingRef = useRef('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		requestAnimationFrame(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		});
	}, []);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setError('');
			setMessages([]);
			setStreamingContent('');
			streamingRef.current = '';
			setIsStreaming(false);
			try {
				const history = await loadHistory(sessionKey);
				if (!cancelled) {
					setMessages(history);
					scrollToBottom();
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Failed to load history');
				}
			}
		}

		load();

		const unsubChat = subscribeToChatEvents((event: ChatEvent) => {
			if (event.sessionKey !== sessionKey) return;
			switch (event.state) {
				case 'delta':
					setIsStreaming(true);
					currentRunIdRef.current = event.runId;
					streamingRef.current += event.content ?? '';
					setStreamingContent(streamingRef.current);
					scrollToBottom();
					break;
				case 'final':
					setMessages(prev => {
						if (event.message) return [...prev, event.message];
						if (streamingRef.current) {
							return [...prev, { role: 'assistant' as const, content: streamingRef.current, usage: event.usage }];
						}
						return prev;
					});
					streamingRef.current = '';
					setStreamingContent('');
					setIsStreaming(false);
					currentRunIdRef.current = undefined;
					scrollToBottom();
					break;
				case 'aborted':
					if (streamingRef.current) {
						setMessages(prev => [...prev, { role: 'assistant' as const, content: streamingRef.current }]);
					}
					streamingRef.current = '';
					setStreamingContent('');
					setIsStreaming(false);
					currentRunIdRef.current = undefined;
					break;
				case 'error':
					setError(event.errorMessage ?? 'Unknown error');
					streamingRef.current = '';
					setStreamingContent('');
					setIsStreaming(false);
					currentRunIdRef.current = undefined;
					break;
			}
		});

		const unsubAgent = subscribeToAgentEvents((event: AgentEvent) => {
			if (event.sessionKey !== sessionKey) return;
			if (event.stream === 'assistant' && event.delta) {
				setIsStreaming(true);
				currentRunIdRef.current = event.runId;
				streamingRef.current += event.delta;
				setStreamingContent(streamingRef.current);
				scrollToBottom();
			}
		});

		return () => {
			cancelled = true;
			unsubChat();
			unsubAgent();
		};
	}, [sessionKey, scrollToBottom]);

	const handleSend = useCallback(async (message: string) => {
		setMessages(prev => [...prev, { role: 'user' as const, content: message }]);
		setError('');
		scrollToBottom();
		try {
			await sendMessage(sessionKey, message);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to send');
		}
	}, [sessionKey, scrollToBottom]);

	const handleAbort = useCallback(async () => {
		try {
			await abortRun(sessionKey, currentRunIdRef.current);
		} catch {
			// ignore abort errors
		}
	}, [sessionKey]);

	return { messages, streamingContent, isStreaming, error, messagesEndRef, handleSend, handleAbort };
}

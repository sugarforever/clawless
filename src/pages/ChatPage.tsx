import { useMemo } from 'react';
import { useParams, useOutletContext } from 'react-router';
import { useChat } from '../hooks/useChat';
import { displayLabel } from '$lib/format';
import type { SessionEntry } from '$lib/types';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import StreamingText from '../components/StreamingText';
import ErrorAlert from '../components/ErrorAlert';

export default function ChatPage() {
	const { key } = useParams<{ key: string }>();
	const sessionKey = decodeURIComponent(key ?? '');
	const { connected, sessions } = useOutletContext<{ connected: boolean; sessions: SessionEntry[] }>();
	const { messages, streamingContent, isStreaming, error, hasNewMessages, messagesEndRef, scrollContainerRef, handleSend, handleAbort, handleScroll, scrollToBottom } = useChat(sessionKey, connected);

	const title = useMemo(() => {
		const session = sessions.find(s => s.key === sessionKey);
		return session ? displayLabel(session) : sessionKey;
	}, [sessions, sessionKey]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="h-[30px] shrink-0" data-tauri-drag-region="" />
			<header className="flex h-11 items-center border-b border-border px-6" data-tauri-drag-region="">
				<h2 className="truncate text-sm font-medium text-muted-foreground" data-tauri-drag-region="">{title}</h2>
			</header>

			{error && <ErrorAlert message={error} />}

			<div className="relative flex-1 overflow-hidden">
				<div ref={scrollContainerRef} onScroll={handleScroll} className="h-full overflow-y-auto">
					<div className="py-4">
						{messages.map((msg, i) => (
							<ChatMessage key={i} message={msg} onInteractiveSubmit={handleSend} />
						))}

						{isStreaming && streamingContent && (
							<div className="px-6 py-4">
								<div className="mx-auto max-w-2xl">
									<span className="text-xs font-medium text-foreground/70">OpenClaw</span>
									<div className="mt-1.5 text-sm leading-relaxed text-foreground">
										<StreamingText content={streamingContent} />
									</div>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
				</div>

				{hasNewMessages && (
					<button
						onClick={scrollToBottom}
						className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-md transition-colors hover:bg-muted hover:text-foreground"
					>
						New messages below
					</button>
				)}
			</div>

			<ChatInput onSend={handleSend} onAbort={handleAbort} isStreaming={isStreaming} />
		</div>
	);
}

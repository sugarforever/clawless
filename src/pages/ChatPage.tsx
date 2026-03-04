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
	const { messages, streamingContent, isStreaming, error, messagesEndRef, handleSend, handleAbort } = useChat(sessionKey, connected);

	const title = useMemo(() => {
		const session = sessions.find(s => s.key === sessionKey);
		return session ? displayLabel(session) : sessionKey;
	}, [sessions, sessionKey]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="h-[30px] shrink-0" data-tauri-drag-region="" />
			<header className="flex h-10 items-center border-b border-border px-6" data-tauri-drag-region="">
				<h2 className="truncate text-sm font-medium text-foreground" data-tauri-drag-region="">{title}</h2>
			</header>

			{error && <ErrorAlert message={error} />}

			<div className="flex-1 overflow-y-auto">
				<div className="mx-auto max-w-3xl px-6 py-6">
					{messages.map((msg, i) => (
						<ChatMessage key={i} message={msg} />
					))}

					{isStreaming && streamingContent && (
						<div className="group mb-4 flex gap-3">
							<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
								A
							</div>
							<div className="flex max-w-[75%] flex-col">
								<div className="rounded-2xl rounded-bl-md bg-card px-4 py-2.5 text-sm leading-relaxed text-card-foreground">
									<StreamingText content={streamingContent} />
								</div>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>
			</div>

			<ChatInput onSend={handleSend} onAbort={handleAbort} isStreaming={isStreaming} />
		</div>
	);
}

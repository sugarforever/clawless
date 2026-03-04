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
				<h2 className="truncate text-xs font-semibold uppercase tracking-widest text-muted-foreground" data-tauri-drag-region="">{title}</h2>
			</header>

			{error && <ErrorAlert message={error} />}

			<div className="flex-1 overflow-y-auto">
				<div className="py-2">
					{messages.map((msg, i) => (
						<ChatMessage key={i} message={msg} />
					))}

					{isStreaming && streamingContent && (
						<div className="px-6 py-3">
							<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">OpenClaw</span>
							<div className="mt-1 text-[13px] leading-[1.7] text-foreground">
								<StreamingText content={streamingContent} />
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

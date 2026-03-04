import { useParams, useOutletContext } from 'react-router';
import { useChat } from '../hooks/useChat';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import StreamingText from '../components/StreamingText';
import ErrorAlert from '../components/ErrorAlert';

export default function ChatPage() {
	const { key } = useParams<{ key: string }>();
	const sessionKey = decodeURIComponent(key ?? '');
	const { connected } = useOutletContext<{ connected: boolean }>();
	const { messages, streamingContent, isStreaming, error, messagesEndRef, handleSend, handleAbort } = useChat(sessionKey, connected);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<header className="flex h-14 items-center border-b border-border px-6">
				<h2 className="truncate text-sm font-medium text-foreground">{sessionKey}</h2>
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

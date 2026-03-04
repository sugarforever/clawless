import { type ChatMessage as ChatMessageType, extractTextContent } from '$lib/types';
import { cn } from '$lib/utils';
import Markdown from './Markdown';

interface Props {
	message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
	const isUser = message.role === 'user';
	const isTool = message.role === 'tool';
	const text = extractTextContent(message.content);

	return (
		<div className={cn('group mb-4 flex gap-3', isUser && 'flex-row-reverse')}>
			<div
				className={cn(
					'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
					isUser
						? 'bg-user-bubble text-user-bubble-foreground'
						: isTool
							? 'bg-amber-950/60 text-amber-400'
							: 'bg-muted text-muted-foreground'
				)}
			>
				{isUser ? 'Y' : isTool ? 'T' : 'A'}
			</div>

			<div className={cn('flex max-w-[75%] flex-col gap-1', isUser && 'items-end')}>
				<div
					className={cn(
						'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
						isUser
							? 'rounded-br-md bg-user-bubble text-user-bubble-foreground'
							: isTool
								? 'rounded-bl-md bg-amber-950/30 font-mono text-xs text-amber-200/80'
								: 'rounded-bl-md bg-card text-card-foreground'
					)}
				>
					<div className="break-words">
						{isUser || isTool ? (
							<span className="whitespace-pre-wrap">{text}</span>
						) : (
							<Markdown content={text} />
						)}
					</div>
				</div>

				{message.usage && (
					<span className="px-1 text-[11px] tabular-nums text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
						{message.usage.inputTokens.toLocaleString()} in / {message.usage.outputTokens.toLocaleString()} out
					</span>
				)}
			</div>
		</div>
	);
}

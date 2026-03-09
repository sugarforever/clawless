import { useState } from 'react';
import { type ChatMessage as ChatMessageType, extractTextContent } from '$lib/types';
import Markdown from './Markdown';
import { ChevronIcon } from './Icons';
import { cn } from '$lib/utils';

interface Props {
	message: ChatMessageType;
	onInteractiveSubmit?: (response: string) => void;
}

const roleConfig: Record<string, { label: string; labelClass: string }> = {
	user: { label: 'You', labelClass: 'text-foreground/70' },
	assistant: { label: 'OpenClaw', labelClass: 'text-foreground/70' },
	tool: { label: 'Tool', labelClass: 'text-muted-foreground' },
	toolResult: { label: 'Tool Result', labelClass: 'text-muted-foreground' },
	system: { label: 'System', labelClass: 'text-muted-foreground' },
};

function CollapsedMessage({ label, text, isError }: { label: string; text: string; isError?: boolean }) {
	const [expanded, setExpanded] = useState(false);
	const preview = text.slice(0, 120).replace(/\n/g, ' ').trim() + (text.length > 120 ? '…' : '');

	return (
		<div className={cn('rounded-lg border bg-muted/20 transition-colors', isError ? 'border-destructive/40' : 'border-border/60')}>
			{/* Header — always visible, clickable */}
			<button
				onClick={() => setExpanded(e => !e)}
				className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/40"
			>
				<ChevronIcon className={cn('h-3 w-3 shrink-0 transition-transform duration-200', expanded && 'rotate-90')} />
				<span className="shrink-0 font-semibold tracking-wide uppercase text-[10px]">{label}</span>
				{!expanded && (
					<span className="truncate font-mono text-[11px] opacity-50">{preview}</span>
				)}
			</button>

			{/* Expanded body — scrollable, selectable */}
			{expanded && (
				<div className="border-t border-border/40">
					<pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words px-3 py-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground selection:bg-primary/20">
						{text}
					</pre>
				</div>
			)}
		</div>
	);
}

export default function ChatMessage({ message, onInteractiveSubmit }: Props) {
	const isCollapsible = message.role === 'toolResult' || message.role === 'tool' || message.role === 'system';
	const config = roleConfig[message.role] ?? roleConfig.system;
	const text = extractTextContent(message.content);
	if (isCollapsible) {
		const label = message.toolName
			? `${config.label}: ${message.toolName}`
			: config.label;
		return (
			<div className="px-6 py-1.5">
				<div className="mx-auto max-w-2xl">
					<CollapsedMessage label={label} text={text} isError={message.isError} />
				</div>
			</div>
		);
	}

	return (
		<div className="group px-6 py-4">
			<div className="mx-auto max-w-2xl">
				<div className="flex items-center gap-2">
					<span className={cn('text-xs font-medium', config.labelClass)}>{config.label}</span>
					{message.usage && (
						<span className="text-[10px] tabular-nums text-muted-foreground/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							{message.usage.inputTokens.toLocaleString()} in / {message.usage.outputTokens.toLocaleString()} out
						</span>
					)}
				</div>
				<div className="mt-1.5 text-sm leading-relaxed text-foreground">
					{message.role === 'user' ? (
						<span className="whitespace-pre-wrap break-words">{text}</span>
					) : (
						<Markdown content={text} onInteractiveSubmit={onInteractiveSubmit} />
					)}
				</div>
			</div>
		</div>
	);
}

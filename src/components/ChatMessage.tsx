import { useState } from 'react';
import { type ChatMessage as ChatMessageType, extractTextContent } from '$lib/types';
import Markdown from './Markdown';
import { ChevronIcon } from './Icons';
import { cn } from '$lib/utils';

interface Props {
	message: ChatMessageType;
}

const roleConfig: Record<string, { label: string; initials: string; color: string }> = {
	user: { label: 'You', initials: 'Y', color: 'bg-blue-600 text-white' },
	assistant: { label: 'OpenClaw', initials: 'OC', color: 'bg-emerald-600 text-white' },
	tool: { label: 'Tool', initials: 'T', color: 'bg-amber-600 text-white' },
	toolResult: { label: 'Tool Result', initials: 'TR', color: 'bg-muted text-muted-foreground' },
	system: { label: 'System', initials: 'S', color: 'bg-muted text-muted-foreground' },
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

export default function ChatMessage({ message }: Props) {
	const isCollapsible = message.role === 'toolResult' || message.role === 'tool' || message.role === 'system';
	const config = roleConfig[message.role] ?? roleConfig.system;
	const text = extractTextContent(message.content);
	if (isCollapsible) {
		const label = message.toolName
			? `${config.label}: ${message.toolName}`
			: config.label;
		return (
			<div className="px-5 py-1">
				<CollapsedMessage label={label} text={text} isError={message.isError} />
			</div>
		);
	}

	return (
		<div className="group px-5 py-2 transition-colors duration-100 hover:bg-muted/30">
			<div className="flex items-start gap-3">
				<div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold ${config.color}`}>
					{config.initials}
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-baseline gap-2">
						<span className="text-sm font-bold text-foreground">{config.label}</span>
						{message.usage && (
							<span className="text-[11px] tabular-nums text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
								{message.usage.inputTokens.toLocaleString()} in / {message.usage.outputTokens.toLocaleString()} out
							</span>
						)}
					</div>
					<div className="mt-0.5 text-sm leading-relaxed text-foreground">
						{message.role === 'user' ? (
							<span className="whitespace-pre-wrap break-words">{text}</span>
						) : (
							<Markdown content={text} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

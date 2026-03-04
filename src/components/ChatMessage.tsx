import { type ChatMessage as ChatMessageType, extractTextContent } from '$lib/types';
import Markdown from './Markdown';

interface Props {
	message: ChatMessageType;
}

const roleConfig = {
	user: { label: 'You', initials: 'Y', color: 'bg-blue-600 text-white' },
	assistant: { label: 'OpenClaw', initials: 'OC', color: 'bg-emerald-600 text-white' },
	tool: { label: 'Tool', initials: 'T', color: 'bg-amber-600 text-white' },
	system: { label: 'System', initials: 'S', color: 'bg-muted text-muted-foreground' },
} as const;

export default function ChatMessage({ message }: Props) {
	const isTool = message.role === 'tool';
	const config = roleConfig[message.role] ?? roleConfig.system;
	const text = extractTextContent(message.content);

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
						{isTool ? (
							<pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-muted/50 p-2 font-mono text-xs text-muted-foreground">{text}</pre>
						) : message.role === 'user' ? (
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

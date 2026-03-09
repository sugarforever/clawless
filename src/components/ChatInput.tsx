import { useState, useRef, useCallback } from 'react';
import { StopIcon, SendIcon } from './Icons';

interface Props {
	onSend: (message: string) => void;
	onAbort: () => void;
	isStreaming: boolean;
}

export default function ChatInput({ onSend, onAbort, isStreaming }: Props) {
	const [input, setInput] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const autoResize = useCallback(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = Math.min(el.scrollHeight, 160) + 'px';
	}, []);

	function handleSubmit() {
		const trimmed = input.trim();
		if (!trimmed) return;
		onSend(trimmed);
		setInput('');
		requestAnimationFrame(() => {
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
			}
		});
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	return (
		<div className="border-t border-border bg-background px-6 py-4">
			<div className="mx-auto flex max-w-2xl items-end gap-2 rounded-lg border border-border bg-card px-4 py-2.5 transition-colors duration-200 focus-within:border-foreground/20">
				<textarea
					ref={textareaRef}
					value={input}
					onChange={e => { setInput(e.target.value); autoResize(); }}
					onKeyDown={handleKeyDown}
					placeholder="Send a message..."
					rows={1}
					className="flex-1 resize-none bg-transparent py-1 text-sm text-foreground placeholder-muted-foreground/60 outline-none"
				/>
				{isStreaming ? (
					<button
						onClick={onAbort}
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-foreground text-background transition-colors duration-200 hover:bg-foreground/80"
						title="Stop generating"
					>
						<StopIcon className="h-3 w-3" />
					</button>
				) : (
					<button
						onClick={handleSubmit}
						disabled={!input.trim()}
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-foreground text-background transition-colors duration-200 hover:bg-foreground/80 disabled:cursor-not-allowed disabled:opacity-20"
						title="Send message"
					>
						<SendIcon className="h-3 w-3" />
					</button>
				)}
			</div>
			<p className="mt-2 text-center text-[11px] text-muted-foreground/30">Enter to send &middot; Shift+Enter for new line</p>
		</div>
	);
}

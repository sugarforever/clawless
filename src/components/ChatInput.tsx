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
		<div className="border-t border-border bg-background px-5 py-3">
			<div>
				<div className="flex items-end gap-2 rounded-xl border border-border bg-card px-3 py-2 ring-ring transition-colors duration-150 focus-within:border-ring focus-within:ring-1">
					<textarea
						ref={textareaRef}
						value={input}
						onChange={e => { setInput(e.target.value); autoResize(); }}
						onKeyDown={handleKeyDown}
						placeholder="Send a message..."
						rows={1}
						className="flex-1 resize-none bg-transparent py-1 text-sm text-foreground placeholder-muted-foreground outline-none"
					/>
					{isStreaming ? (
						<button
							onClick={onAbort}
							className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive text-destructive-foreground transition-colors duration-150 hover:bg-destructive/80"
							title="Stop generating"
						>
							<StopIcon className="h-3.5 w-3.5" />
						</button>
					) : (
						<button
							onClick={handleSubmit}
							disabled={!input.trim()}
							className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors duration-150 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-30"
							title="Send message"
						>
							<SendIcon className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
				<p className="mt-1.5 text-center text-[11px] text-muted-foreground/50">Enter to send, Shift+Enter for new line</p>
			</div>
		</div>
	);
}

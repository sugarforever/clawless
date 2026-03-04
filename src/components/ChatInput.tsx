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
		<div className="border-t border-border bg-background px-4 py-3">
			<div className="mx-auto flex max-w-3xl items-end gap-2">
				<div className="relative flex-1">
					<textarea
						ref={textareaRef}
						value={input}
						onChange={e => { setInput(e.target.value); autoResize(); }}
						onKeyDown={handleKeyDown}
						placeholder="Send a message..."
						rows={1}
						className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder-muted-foreground outline-none ring-ring transition-colors duration-150 focus:border-ring focus:ring-1"
					/>
				</div>

				{isStreaming ? (
					<button
						onClick={onAbort}
						className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground transition-colors duration-150 hover:bg-destructive/80"
						title="Stop generating"
					>
						<StopIcon />
					</button>
				) : (
					<button
						onClick={handleSubmit}
						disabled={!input.trim()}
						className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors duration-150 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-30"
						title="Send message"
					>
						<SendIcon />
					</button>
				)}
			</div>
		</div>
	);
}

import { useState, useRef, useCallback } from 'react';
import { StopIcon, SendIcon, PaperclipIcon, CloseIcon } from './Icons';
import { pickAndReadImages, type PendingAttachment } from '$lib/attachments';

interface Props {
	onSend: (message: string, attachments?: PendingAttachment[]) => void;
	onAbort: () => void;
	isStreaming: boolean;
}

export default function ChatInput({ onSend, onAbort, isStreaming }: Props) {
	const [input, setInput] = useState('');
	const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const autoResize = useCallback(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = Math.min(el.scrollHeight, 160) + 'px';
	}, []);

	const canSend = input.trim() || attachments.length > 0;

	function handleSubmit() {
		if (!canSend) return;
		onSend(input.trim(), attachments.length > 0 ? attachments : undefined);
		setInput('');
		setAttachments([]);
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

	async function handlePickImages() {
		const picked = await pickAndReadImages();
		if (picked.length > 0) {
			setAttachments(prev => [...prev, ...picked]);
		}
	}

	function removeAttachment(index: number) {
		setAttachments(prev => prev.filter((_, i) => i !== index));
	}

	return (
		<div className="border-t border-border bg-background px-6 py-4">
			<div className="mx-auto max-w-2xl">
				{attachments.length > 0 && (
					<div className="mb-2 flex gap-2 overflow-x-auto pb-1">
						{attachments.map((att, i) => (
							<div key={i} className="group/thumb relative shrink-0">
								<img
									src={att.previewUrl}
									alt={att.fileName}
									className="h-16 w-16 rounded-md border border-border/60 object-cover"
								/>
								<button
									onClick={() => removeAttachment(i)}
									className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover/thumb:opacity-100"
									title="Remove"
								>
									<CloseIcon className="h-2.5 w-2.5" />
								</button>
							</div>
						))}
					</div>
				)}
				<div className="flex items-end gap-2 rounded-lg border border-border bg-card px-4 py-2.5 transition-colors duration-200 focus-within:border-foreground/20">
					<button
						onClick={handlePickImages}
						disabled={isStreaming}
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors duration-200 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-20"
						title="Attach image"
					>
						<PaperclipIcon className="h-4 w-4" />
					</button>
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
							disabled={!canSend}
							className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-foreground text-background transition-colors duration-200 hover:bg-foreground/80 disabled:cursor-not-allowed disabled:opacity-20"
							title="Send message"
						>
							<SendIcon className="h-3 w-3" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

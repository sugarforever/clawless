export default function HomePage() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<div className="text-center">
				<div className="mx-auto mb-5 text-6xl animate-[wave_2s_ease-in-out_infinite]">
					🦞
				</div>
				<p className="text-base font-medium text-foreground/80">Pick up where you left off</p>
				<p className="mt-1.5 text-sm text-muted-foreground/60">Choose a session from the sidebar</p>
				<div className="mt-6 flex items-center justify-center gap-1 text-xs text-muted-foreground/30">
					<kbd className="rounded border border-border/50 px-1.5 py-0.5 font-mono text-[10px]">&#8984;N</kbd>
					<span>to start a new one</span>
				</div>
			</div>
		</div>
	);
}

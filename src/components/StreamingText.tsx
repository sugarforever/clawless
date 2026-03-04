import Markdown from './Markdown';

interface Props {
	content: string;
}

export default function StreamingText({ content }: Props) {
	return (
		<span className="break-words">
			<Markdown content={content} />
			<span className="streaming-cursor ml-0.5 inline-block h-[1.1em] w-[3px] translate-y-[2px] rounded-sm bg-foreground/60" />
		</span>
	);
}

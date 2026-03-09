import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import { parseInteractiveBlocks, hasInteractiveBlocks } from '$lib/interactive';
import InteractiveCard from './InteractiveCard';

const components: Components = {
	pre({ children }) {
		return <pre className="my-3 overflow-x-auto rounded-md bg-muted p-4 text-[13px] leading-relaxed">{children}</pre>;
	},
	code({ className, children, ...props }) {
		const isBlock = className?.startsWith('hljs') || className?.startsWith('language-');
		if (isBlock) {
			return <code className={className} {...props}>{children}</code>;
		}
		return <code className="rounded bg-muted px-1.5 py-0.5 text-[13px]" {...props}>{children}</code>;
	},
	a({ href, children }) {
		return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{children}</a>;
	},
	ul({ children }) {
		return <ul className="my-3 ml-5 list-disc space-y-1.5">{children}</ul>;
	},
	ol({ children }) {
		return <ol className="my-3 ml-5 list-decimal space-y-1.5">{children}</ol>;
	},
	p({ children }) {
		return <p className="my-2.5 first:mt-0 last:mb-0">{children}</p>;
	},
	blockquote({ children }) {
		return <blockquote className="my-3 border-l-2 border-border pl-4 text-muted-foreground">{children}</blockquote>;
	},
	table({ children }) {
		return <div className="my-3 overflow-x-auto"><table className="w-full border-collapse text-sm">{children}</table></div>;
	},
	th({ children }) {
		return <th className="border border-border bg-muted px-3 py-1.5 text-left font-medium">{children}</th>;
	},
	td({ children }) {
		return <td className="border border-border px-3 py-1.5">{children}</td>;
	},
	h1({ children }) { return <h1 className="mb-3 mt-6 text-lg font-semibold first:mt-0">{children}</h1>; },
	h2({ children }) { return <h2 className="mb-2.5 mt-5 text-base font-semibold first:mt-0">{children}</h2>; },
	h3({ children }) { return <h3 className="mb-2 mt-4 text-sm font-semibold first:mt-0">{children}</h3>; },
	hr() { return <hr className="my-5 border-border" />; },
};

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];

interface Props {
	content: string;
	onInteractiveSubmit?: (response: string) => void;
}

function MarkdownInner({ content, onInteractiveSubmit }: Props) {
	if (!hasInteractiveBlocks(content)) {
		return (
			<ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={components}>
				{content}
			</ReactMarkdown>
		);
	}

	const segments = parseInteractiveBlocks(content);
	return (
		<>
			{segments.map((seg, i) => {
				if (seg.type === 'interactive' && seg.block) {
					return (
						<InteractiveCard
							key={`ib-${i}`}
							block={seg.block}
							onSubmit={onInteractiveSubmit ?? (() => {})}
						/>
					);
				}
				return (
					<ReactMarkdown
						key={`md-${i}`}
						remarkPlugins={remarkPlugins}
						rehypePlugins={rehypePlugins}
						components={components}
					>
						{seg.content}
					</ReactMarkdown>
				);
			})}
		</>
	);
}

const Markdown = memo(MarkdownInner);
export default Markdown;

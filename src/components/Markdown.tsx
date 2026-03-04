import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';

const components: Components = {
	pre({ children }) {
		return <pre className="my-2 overflow-x-auto rounded bg-muted p-3 text-xs">{children}</pre>;
	},
	code({ className, children, ...props }) {
		const isBlock = className?.startsWith('hljs') || className?.startsWith('language-');
		if (isBlock) {
			return <code className={className} {...props}>{children}</code>;
		}
		return <code className="rounded-sm bg-muted px-1 py-0.5 text-xs font-medium" {...props}>{children}</code>;
	},
	a({ href, children }) {
		return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{children}</a>;
	},
	ul({ children }) {
		return <ul className="my-1.5 ml-4 list-disc space-y-0.5">{children}</ul>;
	},
	ol({ children }) {
		return <ol className="my-1.5 ml-4 list-decimal space-y-0.5">{children}</ol>;
	},
	p({ children }) {
		return <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>;
	},
	blockquote({ children }) {
		return <blockquote className="my-1.5 border-l-2 border-border pl-3 text-muted-foreground">{children}</blockquote>;
	},
	table({ children }) {
		return <div className="my-2 overflow-x-auto"><table className="w-full border-collapse text-xs">{children}</table></div>;
	},
	th({ children }) {
		return <th className="border border-border bg-muted px-2 py-1 text-left font-medium">{children}</th>;
	},
	td({ children }) {
		return <td className="border border-border px-2 py-1">{children}</td>;
	},
	h1({ children }) { return <h1 className="my-2 text-lg font-semibold first:mt-0">{children}</h1>; },
	h2({ children }) { return <h2 className="my-2 text-base font-semibold first:mt-0">{children}</h2>; },
	h3({ children }) { return <h3 className="my-1.5 text-sm font-semibold first:mt-0">{children}</h3>; },
	hr() { return <hr className="my-3 border-border" />; },
};

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];

interface Props {
	content: string;
}

function MarkdownInner({ content }: Props) {
	return (
		<ReactMarkdown
			remarkPlugins={remarkPlugins}
			rehypePlugins={rehypePlugins}
			components={components}
		>
			{content}
		</ReactMarkdown>
	);
}

const Markdown = memo(MarkdownInner);
export default Markdown;

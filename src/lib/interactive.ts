// Interactive Blocks — Adaptive Cards-inspired schema for rich UI in chat

// --- Schema types ---

export interface InteractiveBlock {
	id: string;
	card: {
		body: CardElement[];
		actions?: CardAction[];
	};
}

export type CardElement =
	| TextBlockElement
	| ChoiceSetElement
	| TextInputElement
	| ToggleElement
	| NumberInputElement
	| SeparatorElement;

export interface TextBlockElement {
	type: 'TextBlock';
	text: string;
	size?: 'sm' | 'md' | 'lg';
	weight?: 'normal' | 'bold';
}

export interface ChoiceSetElement {
	type: 'Input.ChoiceSet';
	id: string;
	label?: string;
	style?: 'compact' | 'expanded';
	isMultiSelect?: boolean;
	choices: { title: string; value: string }[];
}

export interface TextInputElement {
	type: 'Input.Text';
	id: string;
	label?: string;
	placeholder?: string;
	isMultiline?: boolean;
}

export interface ToggleElement {
	type: 'Input.Toggle';
	id: string;
	label: string;
	valueOn?: string;
	valueOff?: string;
}

export interface NumberInputElement {
	type: 'Input.Number';
	id: string;
	label?: string;
	min?: number;
	max?: number;
	placeholder?: string;
}

export interface SeparatorElement {
	type: 'Separator';
}

export interface CardAction {
	type: 'Action.Submit';
	title: string;
}

// --- Parser ---

const INTERACTIVE_FENCE = /```interactive\s*\n([\s\S]*?)```/g;

export interface ParsedSegment {
	type: 'text' | 'interactive';
	content: string;
	block?: InteractiveBlock;
}

export function parseInteractiveBlocks(markdown: string): ParsedSegment[] {
	const segments: ParsedSegment[] = [];
	let lastIndex = 0;

	for (const match of markdown.matchAll(INTERACTIVE_FENCE)) {
		const matchStart = match.index;
		if (matchStart > lastIndex) {
			segments.push({ type: 'text', content: markdown.slice(lastIndex, matchStart) });
		}

		try {
			const block = JSON.parse(match[1]) as InteractiveBlock;
			if (block.id && block.card?.body) {
				segments.push({ type: 'interactive', content: match[0], block });
			} else {
				segments.push({ type: 'text', content: match[0] });
			}
		} catch {
			segments.push({ type: 'text', content: match[0] });
		}

		lastIndex = matchStart + match[0].length;
	}

	if (lastIndex < markdown.length) {
		segments.push({ type: 'text', content: markdown.slice(lastIndex) });
	}

	return segments;
}

export function hasInteractiveBlocks(markdown: string): boolean {
	return /```interactive\s*\n/.test(markdown);
}

// --- Response formatter ---

export function formatInteractiveResponse(
	questionText: string,
	values: Record<string, string | string[] | boolean | number>
): string {
	const lines: string[] = [`[选择: ${questionText}]`];
	for (const [key, value] of Object.entries(values)) {
		if (Array.isArray(value)) {
			lines.push(`${key}: ${value.join(', ')}`);
		} else {
			lines.push(`${key}: ${value}`);
		}
	}
	return lines.join('\n');
}

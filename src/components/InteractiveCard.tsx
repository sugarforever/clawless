import { useState, useCallback } from 'react';
import type {
	InteractiveBlock,
	CardElement,
	ChoiceSetElement,
	TextInputElement,
	ToggleElement,
	NumberInputElement,
} from '$lib/interactive';
import { formatInteractiveResponse } from '$lib/interactive';
import { cn } from '$lib/utils';

interface Props {
	block: InteractiveBlock;
	onSubmit: (response: string) => void;
	disabled?: boolean;
}

export default function InteractiveCard({ block, onSubmit, disabled }: Props) {
	const [values, setValues] = useState<Record<string, string | string[] | boolean | number>>({});
	const [submitted, setSubmitted] = useState(false);

	const setValue = useCallback((id: string, value: string | string[] | boolean | number) => {
		setValues(prev => ({ ...prev, [id]: value }));
	}, []);

	const handleSubmit = useCallback(() => {
		const firstTextBlock = block.card.body.find(e => e.type === 'TextBlock');
		const questionText = firstTextBlock && 'text' in firstTextBlock ? firstTextBlock.text : block.id;
		const response = formatInteractiveResponse(questionText, values);
		onSubmit(response);
		setSubmitted(true);
	}, [block, values, onSubmit]);

	const isDisabled = disabled || submitted;

	return (
		<div className={cn(
			'my-2 rounded-lg border border-border bg-muted/20 p-4 transition-opacity',
			isDisabled && 'opacity-60'
		)}>
			{block.card.body.map((element, i) => (
				<CardElementRenderer
					key={i}
					element={element}
					value={values}
					onChange={setValue}
					disabled={isDisabled}
				/>
			))}

			{block.card.actions?.map((action, i) => (
				action.type === 'Action.Submit' && (
					<button
						key={i}
						onClick={handleSubmit}
						disabled={isDisabled}
						className={cn(
							'mt-3 rounded-md px-4 py-1.5 text-xs font-medium transition-colors',
							submitted
								? 'bg-muted text-muted-foreground'
								: 'bg-primary text-primary-foreground hover:bg-primary/90',
							isDisabled && 'cursor-not-allowed'
						)}
					>
						{submitted ? '已提交' : action.title}
					</button>
				)
			))}
		</div>
	);
}

function CardElementRenderer({
	element,
	value,
	onChange,
	disabled,
}: {
	element: CardElement;
	value: Record<string, string | string[] | boolean | number>;
	onChange: (id: string, value: string | string[] | boolean | number) => void;
	disabled: boolean;
}) {
	switch (element.type) {
		case 'TextBlock':
			return (
				<p className={cn(
					'my-1',
					element.weight === 'bold' && 'font-semibold',
					element.size === 'lg' ? 'text-sm' : element.size === 'sm' ? 'text-[11px]' : 'text-xs'
				)}>
					{element.text}
				</p>
			);

		case 'Input.ChoiceSet':
			return <ChoiceSet element={element} value={value} onChange={onChange} disabled={disabled} />;

		case 'Input.Text':
			return <TextInput element={element} value={value} onChange={onChange} disabled={disabled} />;

		case 'Input.Toggle':
			return <Toggle element={element} value={value} onChange={onChange} disabled={disabled} />;

		case 'Input.Number':
			return <NumberInput element={element} value={value} onChange={onChange} disabled={disabled} />;

		case 'Separator':
			return <hr className="my-2 border-border" />;

		default:
			return null;
	}
}

function ChoiceSet({
	element,
	value,
	onChange,
	disabled,
}: {
	element: ChoiceSetElement;
	value: Record<string, string | string[] | boolean | number>;
	onChange: (id: string, v: string | string[]) => void;
	disabled: boolean;
}) {
	const current = value[element.id];
	const isMulti = element.isMultiSelect;
	const isExpanded = element.style === 'expanded';

	if (isExpanded) {
		return (
			<fieldset className="my-2" disabled={disabled}>
				{element.label && <legend className="mb-1 text-[11px] font-medium text-muted-foreground">{element.label}</legend>}
				<div className="space-y-1">
					{element.choices.map(choice => {
						const selected = isMulti
							? (Array.isArray(current) ? current.includes(choice.value) : false)
							: current === choice.value;

						return (
							<label
								key={choice.value}
								className={cn(
									'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors',
									selected ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-foreground/30',
									disabled && 'cursor-not-allowed'
								)}
							>
								<input
									type={isMulti ? 'checkbox' : 'radio'}
									name={element.id}
									value={choice.value}
									checked={selected}
									disabled={disabled}
									onChange={() => {
										if (isMulti) {
											const arr = Array.isArray(current) ? [...current] : [];
											if (arr.includes(choice.value)) {
												onChange(element.id, arr.filter(v => v !== choice.value));
											} else {
												onChange(element.id, [...arr, choice.value]);
											}
										} else {
											onChange(element.id, choice.value);
										}
									}}
									className="accent-primary"
								/>
								{choice.title}
							</label>
						);
					})}
				</div>
			</fieldset>
		);
	}

	// Compact style — dropdown
	return (
		<div className="my-2">
			{element.label && <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{element.label}</label>}
			<select
				value={isMulti ? undefined : (typeof current === 'string' ? current : '')}
				multiple={isMulti}
				disabled={disabled}
				onChange={e => {
					if (isMulti) {
						const selected = Array.from(e.target.selectedOptions, o => o.value);
						onChange(element.id, selected);
					} else {
						onChange(element.id, e.target.value);
					}
				}}
				className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1"
			>
				<option value="">选择...</option>
				{element.choices.map(c => (
					<option key={c.value} value={c.value}>{c.title}</option>
				))}
			</select>
		</div>
	);
}

function TextInput({
	element,
	value,
	onChange,
	disabled,
}: {
	element: TextInputElement;
	value: Record<string, string | string[] | boolean | number>;
	onChange: (id: string, v: string) => void;
	disabled: boolean;
}) {
	const current = typeof value[element.id] === 'string' ? (value[element.id] as string) : '';

	return (
		<div className="my-2">
			{element.label && <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{element.label}</label>}
			{element.isMultiline ? (
				<textarea
					value={current}
					onChange={e => onChange(element.id, e.target.value)}
					placeholder={element.placeholder}
					disabled={disabled}
					rows={3}
					className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1 disabled:cursor-not-allowed"
				/>
			) : (
				<input
					type="text"
					value={current}
					onChange={e => onChange(element.id, e.target.value)}
					placeholder={element.placeholder}
					disabled={disabled}
					className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1 disabled:cursor-not-allowed"
				/>
			)}
		</div>
	);
}

function Toggle({
	element,
	value,
	onChange,
	disabled,
}: {
	element: ToggleElement;
	value: Record<string, string | string[] | boolean | number>;
	onChange: (id: string, v: boolean) => void;
	disabled: boolean;
}) {
	const current = value[element.id] === true;

	return (
		<label className={cn('my-2 flex cursor-pointer items-center gap-2 text-xs', disabled && 'cursor-not-allowed')}>
			<input
				type="checkbox"
				checked={current}
				onChange={e => onChange(element.id, e.target.checked)}
				disabled={disabled}
				className="accent-primary"
			/>
			{element.label}
		</label>
	);
}

function NumberInput({
	element,
	value,
	onChange,
	disabled,
}: {
	element: NumberInputElement;
	value: Record<string, string | string[] | boolean | number>;
	onChange: (id: string, v: number) => void;
	disabled: boolean;
}) {
	const current = typeof value[element.id] === 'number' ? (value[element.id] as number) : '';

	return (
		<div className="my-2">
			{element.label && <label className="mb-1 block text-[11px] font-medium text-muted-foreground">{element.label}</label>}
			<input
				type="number"
				value={current}
				onChange={e => onChange(element.id, e.target.valueAsNumber)}
				min={element.min}
				max={element.max}
				placeholder={element.placeholder}
				disabled={disabled}
				className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1 disabled:cursor-not-allowed"
			/>
		</div>
	);
}

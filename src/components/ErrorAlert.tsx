import { cn } from '$lib/utils';

interface Props {
	message: string;
	className?: string;
}

export default function ErrorAlert({ message, className }: Props) {
	return (
		<div role="alert" className={cn('border-b border-destructive/30 bg-destructive/10 px-6 py-2 text-xs text-destructive', className)}>
			{message}
		</div>
	);
}

import { ChatBubbleIcon } from '../components/Icons';

export default function HomePage() {
	return (
		<div className="flex flex-1 items-center justify-center">
			<div className="text-center">
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
					<ChatBubbleIcon className="h-6 w-6 text-muted-foreground" />
				</div>
				<p className="text-sm text-muted-foreground">Select a session to continue chatting</p>
			</div>
		</div>
	);
}

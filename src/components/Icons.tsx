import { cn } from '$lib/utils';

interface IconProps {
	className?: string;
}

function wrap(className: string | undefined, defaults: string) {
	return cn(defaults, className);
}

export function RefreshIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
			<path d="M3 3v5h5" />
			<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
			<path d="M16 16h5v5" />
		</svg>
	);
}

export function CloseIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-4 w-4')}>
			<path d="M18 6 6 18" /><path d="m6 6 12 12" />
		</svg>
	);
}

export function PlusIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<path d="M12 5v14" /><path d="M5 12h14" />
		</svg>
	);
}

export function SearchIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

export function EditIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
		</svg>
	);
}

export function DeleteIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
		</svg>
	);
}

export function StopIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={wrap(className, 'h-4 w-4')}>
			<rect x="6" y="6" width="12" height="12" rx="1" />
		</svg>
	);
}

export function SendIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-4 w-4')}>
			<path d="m5 12 7-7 7 7" />
			<path d="M12 19V5" />
		</svg>
	);
}

export function SunIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
		</svg>
	);
}

export function MoonIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	);
}

export function MonitorIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<rect width="20" height="14" x="2" y="3" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />
		</svg>
	);
}

export function SettingsIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3.5 w-3.5')}>
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

export function SlackIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127 127" className={wrap(className, 'h-3.5 w-3.5')}>
			<path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
			<path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z" fill="#36C5F0"/>
			<path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z" fill="#2EB67D"/>
			<path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z" fill="#ECB22E"/>
		</svg>
	);
}

export function WhatsAppIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={wrap(className, 'h-3.5 w-3.5')}>
			<path fill="#67C15E" d="M23.993 0C10.762 0 0 10.765 0 24c0 5.248 1.693 10.116 4.57 14.067L1.58 47l9.225-2.964C14.599 46.547 19.126 48 24.007 48 37.238 48 48 37.234 48 24S37.238 0 24.007 0h-.014zm-6.7 12.191c-.466-1.115-.819-1.157-1.524-1.186a14.846 14.846 0 0 0-.804-.028c-.917 0-1.876.268-2.454.86-.706.72-2.455 2.399-2.455 5.841 0 3.443 2.511 6.773 2.849 7.239.353.466 7.744 12.872 14.797 15.793 5.515 2.286 7.152 2.074 8.407 1.806 1.834-.395 4.133-1.75 4.711-3.386.579-1.636.579-3.033.41-3.33-.17-.296-.636-.465-1.341-.818-.705-.353-4.133-2.046-4.791-2.272-.635-.24-1.241-.155-1.72.522-.677.945-1.34 1.905-1.876 2.483-.423.452-1.114.508-1.692.268-.776-.324-2.948-1.087-5.628-3.471-2.074-1.848-3.484-4.148-3.893-4.839-.41-.691-.043-1.101.28-1.482.354-.438.693-.748 1.046-1.157.352-.41.55-.621.775-1.101.24-.466.071-.946-.099-1.299-.169-.353-1.579-3.795-2.157-5.192z"/>
		</svg>
	);
}

export function TelegramIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={wrap(className, 'h-3.5 w-3.5')}>
			<path fill="#1B92D1" d="M88.723 12.142C76.419 17.238 23.661 39.091 9.084 45.047c-9.776 3.815-4.053 7.392-4.053 7.392s8.345 2.861 15.499 5.007c7.153 2.146 10.968-.238 10.968-.238l33.62-22.652c11.922-8.107 9.061-1.431 6.199 1.431-6.199 6.2-16.452 15.975-25.036 23.844-3.815 3.338-1.908 6.199-.238 7.63 6.199 5.246 23.129 15.976 24.082 16.691 5.037 3.566 14.945 8.699 16.452-2.146 0 0 5.961-37.435 5.961-37.435 1.908-12.637 3.815-24.321 4.053-27.659.716-7.612-7.868-4.274-7.868-4.274z"/>
		</svg>
	);
}

export function DiscordIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={wrap(className, 'h-3.5 w-3.5')}>
			<path fill="#5865F2" d="m386 137c-24-11-49.5-19-76.3-23.7c-.5 0-1 0-1.2.6c-3.3 5.9-7 13.5-9.5 19.5c-29-4.3-57.5-4.3-85.7 0c-2.6-6.2-6.3-13.7-10-19.5c-.3-.4-.7-.7-1.2-.6c-23 4.6-52.4 13-76 23.7c-.2 0-.4.2-.5.4c-49 73-62 143-55 213c0 .3.2.7.5 1c32 23.6 63 38 93.6 47.3c.5 0 1 0 1.3-.4c7.2-9.8 13.6-20.2 19.2-31.2c.3-.6 0-1.4-.7-1.6c-10-4-20-8.6-29.3-14c-.7-.4-.8-1.5 0-2c2-1.5 4-3 5.8-4.5c.3-.3.8-.3 1.2-.2c61.4 28 128 28 188 0c.4-.2.9-.1 1.2.1c1.9 1.6 3.8 3.1 5.8 4.6c.7.5.6 1.6 0 2c-9.3 5.5-19 10-29.3 14c-.7.3-1 1-.6 1.7c5.6 11 12.1 21.3 19 31c.3.4.8.6 1.3.4c30.6-9.5 61.7-23.8 93.8-47.3c.3-.2.5-.5.5-1c7.8-80.9-13.1-151-55.4-213c0-.2-.3-.4-.5-.4Zm-192 171c-19 0-34-17-34-38c0-21 15-38 34-38c19 0 34 17 34 38c0 21-15 38-34 38zm125 0c-19 0-34-17-34-38c0-21 15-38 34-38c19 0 34 17 34 38c0 21-15 38-34 38z"/>
		</svg>
	);
}

export function PaperclipIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-4 w-4')}>
			<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
		</svg>
	);
}

export function ImageIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-4 w-4')}>
			<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
			<circle cx="9" cy="9" r="2" />
			<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
		</svg>
	);
}

export function ChevronIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-3 w-3')}>
			<path d="m9 18 6-6-6-6" />
		</svg>
	);
}

export function ChatBubbleIcon({ className }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={wrap(className, 'h-6 w-6')}>
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
		</svg>
	);
}

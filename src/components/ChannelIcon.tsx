import type { ChannelInfo } from '$lib/channels';
import { cn } from '$lib/utils';
import { SlackIcon, WhatsAppIcon, TelegramIcon, DiscordIcon } from './Icons';

const brandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
	slack: SlackIcon,
	whatsapp: WhatsAppIcon,
	telegram: TelegramIcon,
	discord: DiscordIcon,
};

interface Props {
	info: ChannelInfo;
	className?: string;
}

/** Renders a brand icon for known channels, or a text badge fallback. */
export default function ChannelIcon({ info, className }: Props) {
	if (info.icon) {
		const Icon = brandIcons[info.icon];
		if (Icon) return <Icon className={className ?? 'h-3.5 w-3.5'} />;
	}

	return (
		<span className={cn('flex h-4 w-5 items-center justify-center rounded text-[8px] font-bold', info.className)}>
			{info.label}
		</span>
	);
}

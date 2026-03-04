import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import type { SessionEntry } from '$lib/types';
import { filterSessions } from '$lib/sessions';
import { formatTime, displayLabel, parseAgentId, channelBadge } from '$lib/format';
import { cn } from '$lib/utils';
import { SearchIcon } from './Icons';

interface Props {
	sessions: SessionEntry[];
}

export default function SessionList({ sessions }: Props) {
	const [search, setSearch] = useState('');
	const { key: routeKey } = useParams<{ key: string }>();
	const activeKey = routeKey ? decodeURIComponent(routeKey) : null;
	const filtered = useMemo(() => filterSessions(sessions, search), [sessions, search]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="px-3 py-2">
				<div className="relative">
					<SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search sessions..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						className="w-full rounded-md bg-sidebar-muted py-1.5 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground outline-none ring-ring focus:ring-1"
					/>
				</div>
			</div>

			<nav className="flex-1 overflow-y-auto px-2">
				{filtered.map(session => {
					const active = session.key === activeKey;
					const badge = channelBadge(session.channel);
					return (
						<Link
							key={session.key}
							to={`/chat/${encodeURIComponent(session.key)}`}
							className={cn(
								'group flex gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150',
								active
									? 'border-l-2 border-l-primary bg-sidebar-accent text-sidebar-foreground'
									: 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
							)}
						>
							<span className={cn('mt-0.5 flex h-5 w-6 shrink-0 items-center justify-center rounded text-[9px] font-bold', badge.className)}>
								{badge.label}
							</span>
							<div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
								<div className="flex items-center justify-between gap-2">
									<span className={cn('truncate text-sm font-medium', active && 'text-foreground')}>
										{displayLabel(session)}
									</span>
									{parseAgentId(session.key) && (
										<span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
											{parseAgentId(session.key)}
										</span>
									)}
									<span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
										{formatTime(session.updatedAt)}
									</span>
								</div>
								{session.lastMessage && (
									<p className="truncate text-xs text-muted-foreground">
										{session.lastMessage}
									</p>
								)}
							</div>
						</Link>
					);
				})}

				{filtered.length === 0 && (
					<div className="px-3 py-8 text-center text-sm text-muted-foreground">
						{sessions.length === 0 ? 'No sessions yet' : 'No matches'}
					</div>
				)}
			</nav>
		</div>
	);
}

import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import type { SessionEntry } from '$lib/types';
import { filterSessions } from '$lib/sessions';
import { groupSessionsByChannel } from '$lib/channels';
import { formatTime, displayLabel, parseAgentId } from '$lib/format';
import { cn } from '$lib/utils';
import { SearchIcon, ChevronIcon } from './Icons';
import ChannelIcon from './ChannelIcon';

interface Props {
	sessions: SessionEntry[];
}

export default function SessionList({ sessions }: Props) {
	const [search, setSearch] = useState('');
	const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
	const { key: routeKey } = useParams<{ key: string }>();
	const activeKey = routeKey ? decodeURIComponent(routeKey) : null;
	const filtered = useMemo(() => filterSessions(sessions, search), [sessions, search]);
	const groups = useMemo(() => groupSessionsByChannel(filtered), [filtered]);

	function toggleGroup(channel: string) {
		setCollapsed(prev => {
			const next = new Set(prev);
			if (next.has(channel)) next.delete(channel);
			else next.add(channel);
			return next;
		});
	}

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
						autoComplete="off"
						className="w-full rounded-md bg-sidebar-muted py-1.5 pl-8 pr-3 text-sm text-foreground placeholder-muted-foreground outline-none ring-ring focus:ring-1"
					/>
				</div>
			</div>

			<nav className="flex-1 overflow-y-auto px-2">
				{groups.map(group => {
					const isCollapsed = collapsed.has(group.channel);
					return (
						<div key={group.channel}>
							<button
								onClick={() => toggleGroup(group.channel)}
								className="flex w-full items-center gap-1.5 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
							>
								<ChevronIcon className={cn('h-3 w-3 transition-transform duration-150', isCollapsed ? '' : 'rotate-90')} />
								<ChannelIcon info={group.info} />
								{group.info.displayName}
								<span className="ml-auto text-[10px] font-normal tabular-nums text-muted-foreground/60">{group.sessions.length}</span>
							</button>

							{!isCollapsed && group.sessions.map(session => {
								const active = session.key === activeKey;
								return (
									<Link
										key={session.key}
										to={`/chat/${encodeURIComponent(session.key)}`}
										className={cn(
											'group flex gap-3 rounded-lg px-3 py-2.5 ml-2 transition-colors duration-150',
											active
												? 'bg-sidebar-accent text-sidebar-foreground'
												: 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
										)}
									>
										<div className="flex flex-1 flex-col gap-1 overflow-hidden">
											<div className="flex items-baseline justify-between gap-2">
												<span className={cn('truncate text-sm font-medium', active && 'text-foreground')}>
													{displayLabel(session)}
												</span>
												<span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
													{formatTime(session.updatedAt)}
												</span>
											</div>
											<div className="flex items-center gap-1.5 overflow-hidden">
												{parseAgentId(session.key) && (
													<span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
														{parseAgentId(session.key)}
													</span>
												)}
												{(session.lastMessagePreview || session.lastMessage) && (
													<p className="truncate text-xs text-muted-foreground/60">
														{session.lastMessagePreview || session.lastMessage}
													</p>
												)}
											</div>
										</div>
									</Link>
								);
							})}
						</div>
					);
				})}

				{groups.length === 0 && (
					<div className="px-3 py-8 text-center text-sm text-muted-foreground">
						{sessions.length === 0 ? 'No sessions yet' : 'No matches'}
					</div>
				)}
			</nav>
		</div>
	);
}

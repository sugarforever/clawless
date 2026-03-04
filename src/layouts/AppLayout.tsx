import { useState, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useGateway } from '../hooks/useGateway';
import { useAppearance } from '../hooks/useAppearance';
import { disconnect, getGatewayUrl, setAuthToken } from '$lib/gateway';
import { storage, type Appearance } from '$lib/storage';
import SessionList from '../components/SessionList';
import ErrorAlert from '../components/ErrorAlert';
import { RefreshIcon, PlusIcon, SunIcon, MoonIcon, MonitorIcon } from '../components/Icons';

export default function AppLayout() {
	const { sessions, connected, error, refresh, connectToGateway } = useGateway();
	const { appearance, setAppearance } = useAppearance();
	const [showSettings, setShowSettings] = useState(false);
	const [urlInput, setUrlInput] = useState(
		() => storage.getGatewayUrl() || getGatewayUrl()
	);
	const [tokenInput, setTokenInput] = useState(
		() => storage.getAuthToken() || ''
	);
	const location = useLocation();
	const navigate = useNavigate();
	const onAgentsPage = location.pathname.startsWith('/agents');

	const handleConnect = useCallback(() => {
		const url = urlInput.trim();
		if (!url) return;
		const token = tokenInput.trim();
		storage.setGatewayUrl(url);
		if (token) {
			storage.setAuthToken(token);
			setAuthToken(token);
		}
		disconnect();
		connectToGateway(url);
		setShowSettings(false);
	}, [urlInput, tokenInput, connectToGateway]);

	return (
		<div className="flex h-screen bg-background text-foreground">
			<aside className="flex w-72 flex-col border-r border-border bg-sidebar">
				<div className="flex h-14 items-center justify-between border-b border-border px-4">
					<h1 className="font-heading text-base font-semibold tracking-tight">Clawless</h1>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setShowSettings(s => !s)}
							className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
							title={connected ? 'Connected' : 'Disconnected'}
						>
							<span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
							<span className="hidden group-hover:inline">
								{connected ? 'Connected' : 'Offline'}
							</span>
						</button>
						<button
							onClick={refresh}
							className="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
							title="Refresh sessions"
						>
							<RefreshIcon />
						</button>
					</div>
				</div>

				<div className="flex border-b border-border">
					<Link
						to="/"
						className={`flex-1 py-2 text-center text-xs font-medium transition-colors duration-150 ${
							onAgentsPage
								? 'text-muted-foreground hover:text-foreground'
								: 'border-b-2 border-primary text-foreground'
						}`}
					>
						Sessions
					</Link>
					<Link
						to="/agents"
						className={`flex-1 py-2 text-center text-xs font-medium transition-colors duration-150 ${
							onAgentsPage
								? 'border-b-2 border-primary text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						Agents
					</Link>
				</div>

				{showSettings && (
					<div className="border-b border-border px-3 py-3">
						<label htmlFor="gateway-url" className="mb-1.5 block text-xs font-medium text-muted-foreground">Gateway URL</label>
						<input
							id="gateway-url"
							type="text"
							value={urlInput}
							onChange={e => setUrlInput(e.target.value)}
							placeholder="wss://host:18789"
							className="w-full rounded-md border border-border bg-sidebar-muted px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1"
							onKeyDown={e => e.key === 'Enter' && handleConnect()}
						/>
						<label htmlFor="gateway-token" className="mb-1.5 mt-2 block text-xs font-medium text-muted-foreground">Auth Token</label>
						<input
							id="gateway-token"
							type="password"
							value={tokenInput}
							onChange={e => setTokenInput(e.target.value)}
							placeholder="Paste gateway token"
							className="w-full rounded-md border border-border bg-sidebar-muted px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1"
							onKeyDown={e => e.key === 'Enter' && handleConnect()}
						/>
						<button
							onClick={handleConnect}
							className="mt-2 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
						>
							Connect
						</button>

						<div className="mt-3 border-t border-border pt-3">
							<span className="mb-1.5 block text-xs font-medium text-muted-foreground">Appearance</span>
							<div className="flex rounded-md border border-border">
								{([
									{ value: 'light' as Appearance, icon: SunIcon, label: 'Light' },
									{ value: 'system' as Appearance, icon: MonitorIcon, label: 'System' },
									{ value: 'dark' as Appearance, icon: MoonIcon, label: 'Dark' },
								]).map(({ value, icon: Icon, label }) => (
									<button
										key={value}
										onClick={() => setAppearance(value)}
										className={`flex flex-1 items-center justify-center gap-1 py-1.5 text-xs transition-colors duration-150 ${
											appearance === value
												? 'bg-accent font-medium text-foreground'
												: 'text-muted-foreground hover:text-foreground'
										}`}
										title={label}
									>
										<Icon />
										{label}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{error && <ErrorAlert message={error} />}

				{!onAgentsPage && (
					<>
						<div className="px-3 py-2">
							<button
								onClick={() => navigate(`/chat/${encodeURIComponent('clawless:' + crypto.randomUUID().slice(0, 8))}`)}
								className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
							>
								<PlusIcon />
								New Session
							</button>
						</div>
						<SessionList sessions={sessions} />
					</>
				)}
			</aside>

			<main className="flex flex-1 flex-col overflow-hidden">
				<Outlet />
			</main>
		</div>
	);
}

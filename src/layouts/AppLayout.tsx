import { useState, useCallback, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useGateway } from '../hooks/useGateway';
import { useAppearance } from '../hooks/useAppearance';
import { disconnect, getGatewayUrl, setAuthToken } from '$lib/gateway';
import { storage, type Appearance } from '$lib/storage';
import SessionList from '../components/SessionList';
import ErrorAlert from '../components/ErrorAlert';
import { RefreshIcon, PlusIcon, SunIcon, MoonIcon, MonitorIcon, SettingsIcon } from '../components/Icons';

export default function AppLayout() {
	const { sessions, connected, error, refresh, connectToGateway, handleDisconnect } = useGateway();
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
	const popoverRef = useRef<HTMLDivElement>(null);
	const gearRef = useRef<HTMLButtonElement>(null);

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

	useEffect(() => {
		if (!showSettings) return;
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') setShowSettings(false);
		}
		function onClick(e: MouseEvent) {
			if (
				popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
				gearRef.current && !gearRef.current.contains(e.target as Node)
			) {
				setShowSettings(false);
			}
		}
		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('mousedown', onClick);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('mousedown', onClick);
		};
	}, [showSettings]);

	return (
		<div className="flex h-screen bg-background text-foreground">
			<aside className="flex w-72 flex-col border-r border-border bg-sidebar">
				{/* Header */}
				<div className="relative flex h-14 items-center justify-between border-b border-border px-4">
					<h1 className="font-heading text-base font-semibold tracking-tight">Clawless</h1>
					<button
						ref={gearRef}
						onClick={() => setShowSettings(s => !s)}
						className="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
						title="Settings"
					>
						<SettingsIcon />
					</button>

					{/* Settings popover */}
					{showSettings && (
						<div
							ref={popoverRef}
							className="absolute left-2 right-2 top-[calc(100%+4px)] z-50 rounded-lg border border-border bg-sidebar p-3 shadow-lg"
						>
							<span className="mb-1.5 block text-xs font-medium text-muted-foreground">Gateway</span>
							<input
								type="text"
								value={urlInput}
								onChange={e => setUrlInput(e.target.value)}
								placeholder="wss://host:18789"
								disabled={connected}
								className={`w-full rounded-md border border-border bg-sidebar-muted px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1 ${connected ? 'opacity-50' : ''}`}
								onKeyDown={e => e.key === 'Enter' && !connected && handleConnect()}
							/>
							<span className="mb-1.5 mt-2 block text-xs font-medium text-muted-foreground">Auth Token</span>
							<input
								type="password"
								value={tokenInput}
								onChange={e => setTokenInput(e.target.value)}
								placeholder="Paste gateway token"
								disabled={connected}
								className={`w-full rounded-md border border-border bg-sidebar-muted px-2.5 py-1.5 text-xs text-foreground outline-none ring-ring focus:ring-1 ${connected ? 'opacity-50' : ''}`}
								onKeyDown={e => e.key === 'Enter' && !connected && handleConnect()}
							/>
							<div className="mt-2">
								{connected ? (
									<button
										onClick={() => { handleDisconnect(); setShowSettings(false); }}
										className="w-full rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
									>
										Disconnect
									</button>
								) : (
									<button
										onClick={handleConnect}
										className="w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
									>
										Connect
									</button>
								)}
							</div>

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
				</div>

				{/* Tab bar */}
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

				{/* Footer: connection status */}
				<div className="mt-auto flex items-center justify-between border-t border-border px-4 py-2.5">
					<div className="flex items-center gap-2">
						<span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
						<span className="text-xs text-muted-foreground">
							{connected ? 'Connected' : 'Offline'}
						</span>
					</div>
					<button
						onClick={refresh}
						className="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
						title="Refresh sessions"
					>
						<RefreshIcon />
					</button>
				</div>
			</aside>

			<main className="flex flex-1 flex-col overflow-hidden">
				<Outlet context={{ connected }} />
			</main>
		</div>
	);
}

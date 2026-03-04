import { useState, useEffect, useCallback, useRef } from 'react';
import { connect, disconnect, isConnected, setAuthToken } from '$lib/gateway';
import { listSessions, sortByUpdated } from '$lib/sessions';
import { storage } from '$lib/storage';
import type { SessionEntry } from '$lib/types';

export function useGateway() {
	const [sessions, setSessions] = useState<SessionEntry[]>([]);
	const [connected, setConnected] = useState(false);
	const [error, setError] = useState('');
	const mountedRef = useRef(false);

	const connectToGateway = useCallback(async (url?: string) => {
		setConnected(false);
		setError('');
		try {
			await connect(url);
			if (!mountedRef.current) return;
			setConnected(true);
			const result = await listSessions();
			if (!mountedRef.current) return;
			setSessions(sortByUpdated(result));
		} catch (err) {
			if (!mountedRef.current) return;
			setError(err instanceof Error ? err.message : 'Connection failed');
		}
	}, []);

	const refresh = useCallback(async () => {
		if (!isConnected()) return;
		const result = await listSessions();
		setSessions(sortByUpdated(result));
	}, []);

	useEffect(() => {
		mountedRef.current = true;
		const savedToken = storage.getAuthToken();
		if (savedToken) setAuthToken(savedToken);
		const savedUrl = storage.getGatewayUrl();
		connectToGateway(savedUrl || undefined);
		return () => {
			mountedRef.current = false;
			disconnect();
		};
	}, [connectToGateway]);

	const handleDisconnect = useCallback(() => {
		disconnect();
		setConnected(false);
		setSessions([]);
		setError('');
	}, []);

	return { sessions, connected, error, refresh, connectToGateway, handleDisconnect, setError };
}

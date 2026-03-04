import { useState, useEffect, useCallback } from 'react';
import { storage, type Appearance } from '$lib/storage';

function applyTheme(mode: Appearance) {
	const dark =
		mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	document.documentElement.classList.toggle('dark', dark);
}

export function useAppearance() {
	const [appearance, setAppearanceState] = useState<Appearance>(storage.getAppearance);

	const setAppearance = useCallback((mode: Appearance) => {
		storage.setAppearance(mode);
		setAppearanceState(mode);
		applyTheme(mode);
	}, []);

	useEffect(() => {
		applyTheme(appearance);
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		function onChange() {
			if (storage.getAppearance() === 'system') applyTheme('system');
		}
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, [appearance]);

	return { appearance, setAppearance };
}

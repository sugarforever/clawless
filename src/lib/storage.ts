const KEYS = {
	AUTH_TOKEN: 'clawless:auth-token',
	GATEWAY_URL: 'clawless:gateway-url'
} as const;

export const storage = {
	getAuthToken: () => localStorage.getItem(KEYS.AUTH_TOKEN),
	setAuthToken: (t: string) => localStorage.setItem(KEYS.AUTH_TOKEN, t),
	getGatewayUrl: () => localStorage.getItem(KEYS.GATEWAY_URL),
	setGatewayUrl: (url: string) => localStorage.setItem(KEYS.GATEWAY_URL, url)
};

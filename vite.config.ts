import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true
	},
	build: {
		outDir: 'build'
	},
	resolve: {
		alias: {
			'$lib': path.resolve(__dirname, './src/lib')
		}
	}
});

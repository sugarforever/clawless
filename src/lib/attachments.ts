import { open } from '@tauri-apps/plugin-dialog';
import { readFile } from '@tauri-apps/plugin-fs';
import type { Attachment } from './types';

export interface PendingAttachment {
	fileName: string;
	mimeType: string;
	content: string;
	previewUrl: string;
	sizeBytes: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const MIME_MAP: Record<string, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	webp: 'image/webp',
	svg: 'image/svg+xml',
};

function getMimeType(fileName: string): string {
	const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
	return MIME_MAP[ext] ?? 'application/octet-stream';
}

function uint8ToBase64(bytes: Uint8Array): string {
	let binary = '';
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

export async function pickAndReadImages(): Promise<PendingAttachment[]> {
	const selected = await open({
		multiple: true,
		filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }],
	});

	if (!selected) return [];

	const paths = Array.isArray(selected) ? selected : [selected];
	const results: PendingAttachment[] = [];

	for (const filePath of paths) {
		const bytes = await readFile(filePath);
		if (bytes.length > MAX_FILE_SIZE) continue;

		const fileName = filePath.split('/').pop() ?? 'image';
		const mimeType = getMimeType(fileName);
		const content = uint8ToBase64(bytes);
		const previewUrl = `data:${mimeType};base64,${content}`;

		results.push({ fileName, mimeType, content, previewUrl, sizeBytes: bytes.length });
	}

	return results;
}

export function toAttachment(pending: PendingAttachment): Attachment {
	return {
		mimeType: pending.mimeType,
		fileName: pending.fileName,
		content: pending.content,
	};
}

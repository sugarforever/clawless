import { useState, useEffect, useCallback } from 'react';
import type { AgentSummary } from '$lib/types';
import { createAgent, updateAgent } from '$lib/agents';
import ErrorAlert from './ErrorAlert';
import { CloseIcon } from './Icons';

interface Props {
	agent: AgentSummary | null;
	onClose: () => void;
	onSave: () => void;
}

export default function AgentEditor({ agent, onClose, onSave }: Props) {
	const editing = agent !== null;
	const [name, setName] = useState(agent?.name ?? '');
	const [workspace, setWorkspace] = useState(agent?.workspace ?? '');
	const [model, setModel] = useState(agent?.model ?? '');
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setName(agent?.name ?? '');
		setWorkspace(agent?.workspace ?? '');
		setModel(agent?.model ?? '');
	}, [agent]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose();
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	const handleSave = useCallback(async () => {
		if (!name.trim()) {
			setError('Name is required');
			return;
		}
		setSaving(true);
		setError('');
		try {
			if (editing && agent) {
				await updateAgent({
					agentId: agent.id,
					name: name.trim(),
					workspace: workspace.trim() || undefined,
					model: model.trim() || undefined
				});
			} else {
				await createAgent({
					name: name.trim(),
					workspace: workspace.trim() || undefined
				});
			}
			onSave();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to save');
		} finally {
			setSaving(false);
		}
	}, [editing, agent, name, workspace, model, onSave]);

	return (
		<div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
			<button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close overlay" />
			<div className="relative flex w-96 flex-col bg-background shadow-xl">
				<div className="flex h-14 items-center justify-between border-b border-border px-4">
					<h2 className="text-sm font-semibold">{editing ? 'Edit Agent' : 'New Agent'}</h2>
					<button
						onClick={onClose}
						className="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
						aria-label="Close"
					>
						<CloseIcon />
					</button>
				</div>

				<div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
					{error && <ErrorAlert message={error} className="rounded-md border-b-0" />}

					<div>
						<label htmlFor="agent-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">Name</label>
						<input
							id="agent-name"
							type="text"
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder="My Agent"
							className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-1"
						/>
					</div>

					<div>
						<label htmlFor="agent-workspace" className="mb-1.5 block text-xs font-medium text-muted-foreground">Workspace</label>
						<input
							id="agent-workspace"
							type="text"
							value={workspace}
							onChange={e => setWorkspace(e.target.value)}
							placeholder="/path/to/workspace"
							className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-1"
						/>
					</div>

					{editing && (
						<div>
							<label htmlFor="agent-model" className="mb-1.5 block text-xs font-medium text-muted-foreground">Model</label>
							<input
								id="agent-model"
								type="text"
								value={model}
								onChange={e => setModel(e.target.value)}
								placeholder="e.g. claude-sonnet-4-6"
								className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-1"
							/>
						</div>
					)}
				</div>

				<div className="flex gap-2 border-t border-border p-4">
					<button
						onClick={onClose}
						className="flex-1 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={saving}
						className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 disabled:opacity-50"
					>
						{saving ? 'Saving...' : 'Save'}
					</button>
				</div>
			</div>
		</div>
	);
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import { listAgents, deleteAgent } from '$lib/agents';
import { agentInitials } from '$lib/format';
import type { AgentSummary } from '$lib/types';
import AgentEditor from '../components/AgentEditor';
import ErrorAlert from '../components/ErrorAlert';
import { EditIcon, DeleteIcon } from '../components/Icons';

export default function AgentsPage() {
	const [agents, setAgents] = useState<AgentSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [editorAgent, setEditorAgent] = useState<AgentSummary | null>(null);
	const [showEditor, setShowEditor] = useState(false);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			setAgents(await listAgents());
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load agents');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { refresh(); }, [refresh]);

	const sorted = useMemo(
		() => [...agents].sort((a, b) => {
			if (a.default) return -1;
			if (b.default) return 1;
			return (a.name ?? a.id).localeCompare(b.name ?? b.id);
		}),
		[agents]
	);

	function openCreate() {
		setEditorAgent(null);
		setShowEditor(true);
	}

	function openEdit(agent: AgentSummary) {
		setEditorAgent(agent);
		setShowEditor(true);
	}

	function closeEditor() {
		setShowEditor(false);
		setEditorAgent(null);
	}

	async function handleEditorSave() {
		closeEditor();
		await refresh();
	}

	async function handleDelete(agentId: string) {
		if (confirmDeleteId !== agentId) {
			setConfirmDeleteId(agentId);
			return;
		}
		setConfirmDeleteId(null);
		try {
			await deleteAgent(agentId);
			await refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete agent');
		}
	}

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="flex h-14 items-center justify-between border-b border-border px-6">
				<h1 className="font-heading text-base font-semibold">Agents</h1>
				<button
					onClick={openCreate}
					className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
				>
					New Agent
				</button>
			</div>

			{error && <ErrorAlert message={error} />}

			<div className="flex-1 overflow-y-auto p-6">
				{loading ? (
					<div className="py-12 text-center text-sm text-muted-foreground">Loading agents...</div>
				) : sorted.length === 0 ? (
					<div className="py-12 text-center text-sm text-muted-foreground">No agents found</div>
				) : (
					<div className="grid gap-3">
						{sorted.map(agent => (
							<div key={agent.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-xs font-bold text-muted-foreground">
									{agentInitials(agent)}
								</div>
								<div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
									<div className="flex items-center gap-2">
										<span className="truncate text-sm font-medium">{agent.name ?? agent.id}</span>
										{agent.default && (
											<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
												default
											</span>
										)}
									</div>
									<div className="flex gap-3 text-xs text-muted-foreground">
										<span>ID: {agent.id}</span>
										{agent.workspace && <span className="truncate">workspace: {agent.workspace}</span>}
										{agent.model && <span>{agent.model}</span>}
									</div>
								</div>
								<div className="flex shrink-0 items-center gap-1">
									<button
										onClick={() => openEdit(agent)}
										className="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
										title="Edit"
									>
										<EditIcon />
									</button>
									{!agent.default && (
										<button
											onClick={() => handleDelete(agent.id)}
											className="rounded-md p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive"
											title={confirmDeleteId === agent.id ? 'Click again to confirm' : 'Delete'}
										>
											<DeleteIcon />
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{showEditor && (
				<AgentEditor agent={editorAgent} onClose={closeEditor} onSave={handleEditorSave} />
			)}
		</div>
	);
}

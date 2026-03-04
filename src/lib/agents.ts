import { send } from './gateway';
import type { AgentSummary, AgentCreateParams, AgentUpdateParams } from './types';

export async function listAgents(): Promise<AgentSummary[]> {
	const result = await send<{ agents: AgentSummary[] }>('agents.list', {});
	return result.agents;
}

export async function createAgent(params: AgentCreateParams): Promise<AgentSummary> {
	return send<AgentSummary>('agents.create', { ...params });
}

export async function updateAgent(params: AgentUpdateParams): Promise<AgentSummary> {
	const { agentId, ...rest } = params;
	return send<AgentSummary>('agents.update', { agentId, ...rest });
}

export async function deleteAgent(agentId: string, deleteFiles = false): Promise<void> {
	await send('agents.delete', { agentId, deleteFiles });
}

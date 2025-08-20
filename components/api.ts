

import type { GeneratedSpa, LlmStrategy, DeployPageRequest, DeployPageSuccessResponse } from '../types';

const API_BASE_URL = 'https://api.andiegogiap.com/v1';

// We'll assume a dummy JWT for now. In a real app, this would be handled by an auth flow.
const DUMMY_JWT = 'dummy-jwt-for-testing';

export async function startWorkflow(objective: string, agents: string[], strategy: LlmStrategy): Promise<{ instanceId: string }> {
    const response = await fetch(`${API_BASE_URL}/workflows/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DUMMY_JWT}`,
        },
        body: JSON.stringify({
            name: 'CUA_Mission_Orchestration', // The OpenAPI spec requires a name.
            params: {
                objective,
                agents,
                llmStrategy: strategy,
            }
        }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({error: 'An unknown error occurred'}));
        throw new Error(err.error || `Failed to start workflow with status ${response.status}`);
    }
    return response.json();
}

export async function getLedgerSpas(query: string = ''): Promise<GeneratedSpa[]> {
    const url = new URL(`${API_BASE_URL}/ledger/spas`);
    if (query) {
        url.searchParams.append('q', query);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
        const err = await response.json().catch(() => ({error: 'An unknown error occurred'}));
        throw new Error(err.error || `Failed to fetch ledger SPAs with status ${response.status}`);
    }
    // The API might return items sorted oldest first, let's reverse for newest first UI
    const spas: GeneratedSpa[] = await response.json();
    return spas.sort((a, b) => b.createdAt - a.createdAt);
}

export async function shareSpaContext(id: string): Promise<{ ok: boolean }> {
    const response = await fetch(`${API_BASE_URL}/ledger/spas/${id}/share`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${DUMMY_JWT}` },
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({error: 'An unknown error occurred'}));
        throw new Error(err.error || `Failed to share context with status ${response.status}`);
    }
    return response.json();
}

export async function replaySpa(id: string): Promise<{ ok: boolean; objective: string; agents: string[]; llmStrategy: LlmStrategy }> {
    const response = await fetch(`${API_BASE_URL}/ledger/spas/${id}/replay`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${DUMMY_JWT}` },
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({error: 'An unknown error occurred'}));
        throw new Error(err.error || `Failed to get replay data with status ${response.status}`);
    }
    return response.json();
}

export async function deployPage(data: DeployPageRequest): Promise<DeployPageSuccessResponse> {
  // As per instructions, frontend calls a proxy path. The proxy handles auth.
  const response = await fetch('/orch/v1/gemini/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    // Throw an error that includes the message from the API response
    throw new Error(responseData.error || `Deployment failed with status ${response.status}`);
  }

  return responseData;
}

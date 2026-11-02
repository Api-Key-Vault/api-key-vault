import { apiClient } from '@/shared/api';
import type { ApiKeyAccess, GrantApiKeyAccess } from '../model/types';

export async function getApiKeyAccesses(teamId : number, apiKeyId : number) : Promise<ApiKeyAccess[]>{
    const response = await apiClient.get<ApiKeyAccess[]>(`teams/${teamId}/keys/${apiKeyId}/accesses`);
    return response.data;
}

export async function grantKeyAccess(teamId : number, request: GrantApiKeyAccess) : Promise<ApiKeyAccess>{
    const response = await apiClient.post<ApiKeyAccess>(`teams/${teamId}/keys/accesses`, request);
    return response.data;
}

export async function revokeKeyAccess(teamId : number, apiKeyId : number, teamMemberId: number) : Promise<void>{
    await apiClient.delete(`teams/${teamId}/keys/${apiKeyId}/accesses/${teamMemberId}`);
}
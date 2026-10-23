import { apiClient } from '@/shared/api';
import type {
  ApiKey,
  CreateApiKeyRequest,
  RevealApiKeyResponse,
  UpdateApiKeyRequest,
} from '../model/types';

export async function getApiKeys(teamId: number): Promise<ApiKey[]> {
  const response = await apiClient.get<ApiKey[]>(`teams/${teamId}/keys`);
  return response.data;
}

export async function createApiKey(teamId: number, request: CreateApiKeyRequest): Promise<ApiKey> {
  const response = await apiClient.post<ApiKey>(`teams/${teamId}/keys`, request);
  return response.data;
}

export async function updateApiKey(teamId: number, keyId: number, request: UpdateApiKeyRequest): Promise<ApiKey> {
  const response = await apiClient.patch<ApiKey>(`teams/${teamId}/keys/${keyId}`, request);
  return response.data;
}

export async function revokeApiKey(teamId: number, keyId: number): Promise<void> {
  await apiClient.post(`teams/${teamId}/keys/${keyId}/revoke`);
}

export async function revealApiKey(teamId: number, keyId: number): Promise<RevealApiKeyResponse> {
  const response = await apiClient.post<RevealApiKeyResponse>(`teams/${teamId}/keys/${keyId}/reveal`);
  return response.data;
}

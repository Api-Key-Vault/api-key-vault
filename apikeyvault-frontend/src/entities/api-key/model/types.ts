export type ApiKeyStatus = "Active" | "Expired" | "Revoked";

export type ApiKey = {
  id: number;
  name: string;
  category: string | null;
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
  status: ApiKeyStatus;
};

export type CreateApiKeyRequest = {
  name: string;
  value: string;
  category: string | null;
  expiresAt: string | null;
};

export type UpdateApiKeyRequest = {
  name: string;
  value: string | null;
  category: string | null;
  expiresAt: string | null;
};

export type RevealApiKeyResponse = {
  id: number;
  value: string;
};

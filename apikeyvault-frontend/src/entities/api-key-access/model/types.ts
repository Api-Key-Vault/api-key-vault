
export type ApiKeyAccess = {
    apiKeyId: number;
    teamMemberId: number;
    displayName: string;
    assignedAt: string;
    grantedByMemberId: number;
};

export type GrantApiKeyAccess = {
    apiKeyId: number;
    teamMemberId: number;
}
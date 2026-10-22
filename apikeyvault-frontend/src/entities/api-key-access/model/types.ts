
export type ApiKeyAccess = {
    apiKeyId: number;
    teamMemberId: number;
    displayName: string;
    grantedByMemberId: number;
};

export type GrantApiKeyAccess = {
    apiKeyId: number;
    teamMemberId: number;
}
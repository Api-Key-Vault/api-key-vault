export type {
    ApiKeyAccess,
    GrantApiKeyAccess
} from './model/types';

export {
    getApiKeyAccesses,
    grantKeyAccess,
    revokeKeyAccess
} from './api/apiKeyAccessService';
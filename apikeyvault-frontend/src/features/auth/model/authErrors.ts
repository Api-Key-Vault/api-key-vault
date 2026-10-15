
export const  AUTH_ERROR_MESSAGE : Record<string, string> = {
    access_denied: 'Access denied. You cancelled the GitHub sign-in.',
    login_failed: 'GitHub sign-in failed. Please try again.',
    invalid_login: 'Authentication failed. Please check your GitHub account.',
    locked_out: 'Access blocked. Please verify your account status on GitHub.',
    not_allowed: 'Your GitHub account does not have permission to access this app.'
} as const;

export function getAuthErrors(incomingErroKey : string) : string{
    
    return AUTH_ERROR_MESSAGE[incomingErroKey] ?? 'An unexpected authentication error occurred.'
}
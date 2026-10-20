const AUTH_ERROR_MESSAGES: Record<string, string> = {
    access_denied: 'Access denied. You cancelled the GitHub sign-in.',
    login_failed: 'GitHub sign-in failed. Please try again.',
    invalid_login: 'Authentication failed. Please check your GitHub account.',
    locked_out: 'Access blocked. Please verify your account status on GitHub.',
    not_allowed: 'Your GitHub account does not have permission to access this app.',
};

export function getAuthErrorMessage(errorKey: string): string {
    
    return AUTH_ERROR_MESSAGES[errorKey] ?? 'An unexpected authentication error occurred.';
}
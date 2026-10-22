import axios from "axios";
import { apiClient } from '@/shared/api';
import type { User } from '@/entities/user';

export function loginWithGithub(token? : string): void {
    const fullUrl = apiClient.getUri({
        url: 'Auth/github',
        params: {
            token
        }
    });

    window.location.assign(fullUrl);
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const response = await apiClient.get<User>("Auth/me");
        return response.data;
    } catch (error: unknown) {
        if (isUnauthorized(error)) {
            return null;
        }
        throw error;
    }
}

export async function logout(): Promise<void> {
    await apiClient.post("Auth/logout");
}

function isUnauthorized(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 401;
}

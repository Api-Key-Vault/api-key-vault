import type { User } from '@/entities/user';

export type AuthState = 
    | { status: "loading" }
    | { status: "unauthenticated"}
    | { status: "authenticated"; user: User }
    | { status: "error"; error: Error }


export interface AuthContextValue{
        state: AuthState;
        logout : () => Promise<void>
    }

import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthState } from "./types";
import { getCurrentUser, logout as logoutRequest } from '../api/authService';

export function AuthProvider ({children } : PropsWithChildren){
    const [state, setState] = useState<AuthState>({status: "loading"});

    useEffect(() => {
        let cancelled = false;

        async function checkCurrentUser() {
            try {
                const currentUser = await getCurrentUser();

                if(cancelled){
                    return;
                }

                if(currentUser === null ){
                    setState({status: "unauthenticated"});
                } else{
                    setState({status: "authenticated", user: currentUser});
                }

            } catch (error) {
                if(!cancelled){
                    setState({
                        status: "error", 
                        error: error instanceof Error
                            ? error: new Error("Failed to get current user")
                    });
                }                
            }
        }
        checkCurrentUser();
        return () => {
            cancelled = true;
        }
    }, []);

    const logout = useCallback(async () =>{        
        await logoutRequest();
        setState({status: "unauthenticated"});       
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({state, logout}),
        [state, logout]
    );

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
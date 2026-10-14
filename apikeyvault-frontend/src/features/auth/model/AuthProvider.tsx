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
                setState({status: "loading"});
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
                //Potential TODO: Offer user retry login after error?              
            }
        }
        checkCurrentUser();
        return () => {
            cancelled = true;
        }
    }, []);

    const logout = useCallback(async () =>{      
        try {
            if(state.status !== "authenticated"){
                return;
            }            
            await logoutRequest();
            setState({status: "unauthenticated"});     
        } catch (error) {
            if(error instanceof Error){
                console.error("Error logging out: " + error.message);                
            }            
        //Potential TODO: feedback to user if not able to logout, offer retry?
        //TODO: add disabled on logout button if (state.status === "loading")
        }  
    }, [state]);

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
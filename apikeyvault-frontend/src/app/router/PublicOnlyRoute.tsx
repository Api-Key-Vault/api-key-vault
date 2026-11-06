import { type PropsWithChildren } from "react";
import { useAuth } from "@/features/auth";
import { Navigate } from "react-router";
import { ROUTE_PATHS } from "./paths";
import { PageLoading } from "@/shared/ui";
import { useShowLoading } from "@/shared/lib";

export function PublicOnlyRoute({children} : PropsWithChildren){
    const { state } = useAuth();
    const showLoading = useShowLoading(state.status === "loading")
    
    switch (showLoading)
    {
        case "wait":
            return null;
        case "showLoading":
            return <PageLoading isLoading={true} />;
        case "finishing":
            return <PageLoading isLoading={false} />;
        case "done": {
             switch (state.status){
                case "loading": 
                    return null;
                case "unauthenticated":
                    return children;
                case "error":
                    return children;
                // TODO: Add errorMessage if we want: `ERROR: ${state.error.message}`;
                case "authenticated":
                    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
    }
        }
            
    }

   
}

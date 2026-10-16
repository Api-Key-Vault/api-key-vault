import { type PropsWithChildren } from "react";
import { useAuth } from "../model/useAuth";
import { Navigate } from "react-router";
import { ROUTE_PATHS } from "@/shared/config/routes";
import { Loading } from "@/shared/ui/Loading";

export function PublicOnlyRoute({children} : PropsWithChildren){
    const { state } = useAuth();

    switch (state.status){
        case "loading": 
            return <Loading />
        case "unauthenticated":
            return children;
        case "error":
            return children;
        // TODO: Add error banner if we want: `ERROR: ${state.error.message}`;
        case "authenticated":
            return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
    }
}
import { type PropsWithChildren } from "react";
import { useAuth } from "@/features/auth";
import { Navigate } from "react-router";
import { ROUTE_PATHS } from "./paths";
import { Loading } from "@/shared/ui";

export function ProtectedRoute({ children }: PropsWithChildren) {
    const { state } = useAuth();

    switch (state.status) {
        case "loading":
            return <Loading />;
        case "unauthenticated":
            return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
        case "error":
            return <div>ERROR: {state.error.message}</div>;
        case "authenticated":
            return children;
    }
}

import { type PropsWithChildren } from "react";
import { useAuth } from "@/features/auth";
import { Navigate } from "react-router";
import { ROUTE_PATHS } from "./paths";
import { PageLoading } from "@/shared/ui";
import { useShowLoading } from "@/shared/lib";

export function ProtectedRoute({ children }: PropsWithChildren) {
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
        case "done":
            { switch (state.status) {
                    case "loading":
                        return null;
                    case "unauthenticated":
                        return <Navigate to={ROUTE_PATHS.HOME} replace />;
                    case "error":
                        return <div>ERROR: {state.error.message}</div>;
                    case "authenticated":
                        return children;
            }
            }
    }

   
}

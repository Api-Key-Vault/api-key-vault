import { type PropsWithChildren } from "react";
import { useAuth } from "@/features/auth";
import { Navigate } from "react-router";
import { ROUTE_PATHS } from "./paths";
import { PageLoading, PrimaryButton } from "@/shared/ui";
import { useShowLoading } from "@/shared/lib";

export function ProtectedRoute({ children }: PropsWithChildren) {
    const { state, retry } = useAuth();
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
                        return (
                            <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
                                <p className="text-text text-2xl text-center">
                                    Something went wrong on our side. Please try again.
                                </p>
                                <PrimaryButton className="text-xl px-4! py-1!" onClick={retry}>
                                    Try again
                                </PrimaryButton>
                            </div>
                        );
                    case "authenticated":
                        return children;
            }
        }
    }
}

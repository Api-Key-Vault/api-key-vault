import { type PropsWithChildren, useState } from "react";
import { useAuth } from "@/features/auth";
import { Navigate } from "react-router";
import { ROUTE_PATHS } from "./paths";
import { ErrorMessage, PageLoading } from "@/shared/ui";
import { useShowLoading } from "@/shared/lib";

export function PublicOnlyRoute({children} : PropsWithChildren){
    const { state } = useAuth();
    const showLoading = useShowLoading(state.status === "loading")
    const [isErrorVisible, setIsErrorVisible] = useState(true);
    
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
                    return (
                        <>
                            {isErrorVisible && (
                                <ErrorMessage
                                    message="Something went wrong on our side. Please try again."
                                    onClose={() => setIsErrorVisible(false)}
                                />
                            )}
                            {children}
                        </>
                    );
                case "authenticated":
                    return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
            }
        }
    }
}

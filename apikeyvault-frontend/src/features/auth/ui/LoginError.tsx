import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router";
import { ErrorMessage } from "@/shared/ui";
import { getAuthErrorMessage } from "../model/authErrors";

export function LoginError() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [errorMessage, setErrorMessage] = useState<string | null>(() => {
        const errorKey = searchParams.get('error');

        if (errorKey === null) {
            return null;
        }

        return getAuthErrorMessage(errorKey);
    });

    useEffect(() => {
        if (!searchParams.has("error")) {
            return;
        }

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('error');

        setSearchParams(nextParams, { replace: true });
    }, [searchParams, setSearchParams]);

    if (errorMessage === null) {
        return null;
    }

    return <ErrorMessage message={errorMessage} onClose={() => {setErrorMessage(null)}} />;
}

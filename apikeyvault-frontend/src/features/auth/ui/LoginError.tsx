import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router";
import { ErrorMessage } from "@/shared";
import { getAuthErrors } from "../model/authErrors";

export function LoginError(){
    const [errorParams, setErrorParams]= useSearchParams();
    const [errorMessage, setErrorMessage]  = useState<string|null>(null);
    

    useEffect(() => {
        const newParams = new URLSearchParams(errorParams);
        const backendError = newParams.get('error');
       
        if(backendError=== null) return;
        
        const message = getAuthErrors(backendError);
        setErrorMessage(message);

        newParams.delete('error');
        setErrorParams(newParams, {replace: true});
    
    },[errorParams, setErrorParams]);

    if(errorMessage === null) {
        return null;
    }
    
    return(<ErrorMessage message={ errorMessage } />) 
}

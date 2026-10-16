import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router";
import { ErrorMessage } from "@/shared";
import { getAuthErrors } from "../model/authErrors";

export function LoginError(){
    const [errorParams, setErrorParams]= useSearchParams();   

    const [errorMessage] = useState<string | null>(() => {        
        const backendError = errorParams.get('error');

        if(backendError === null) return null;
        
        return getAuthErrors(backendError);   
    });    

    useEffect(() => {
        if(!errorParams.has("error")) return;

        const newParams = new URLSearchParams(errorParams);     
        newParams.delete('error');

        setErrorParams(newParams, {replace: true});    
    },[errorParams, setErrorParams]);

    if(errorMessage === null) {
        return null;
    }

    return(<ErrorMessage message={ errorMessage } />) 
}

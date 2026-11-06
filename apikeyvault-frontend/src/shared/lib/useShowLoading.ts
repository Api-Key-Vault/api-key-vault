import { useEffect, useState } from "react";

type ShowLoadingState = 
    | "wait"
    | "showLoading"
    | "finishing"
    | "done"

const showDelay = 200;
const finishDelay = 500;

export function useShowLoading(isLoading: boolean){  
    const [showLoading, setShowLoading] = useState<ShowLoadingState>(isLoading ? "wait" : "done");

//Outside of useEffect to avoid cascading renders.
    if(showLoading === "wait" && !isLoading){
            setShowLoading("done");                    
        }
    if(showLoading === "done" && isLoading){
            setShowLoading("wait");
        }  
    if(showLoading === "showLoading" && !isLoading){
            setShowLoading("finishing");            
        }   

    useEffect(() => {
        
        if(showLoading === "wait" && isLoading){
            const showTimeOut = setTimeout(() => {
                setShowLoading("showLoading");
            }, showDelay)     
            
            return () => clearTimeout(showTimeOut);            
        } 
        
        if (showLoading === "finishing"){
            const finishTimeOut = setTimeout(() => {   
                setShowLoading("done");            
            }, finishDelay)

            return () => clearTimeout(finishTimeOut);
        }          
        
    }, [isLoading, showLoading]);

    return showLoading;
}
   
import { useState, useEffect } from "react";

const maxValue = 91;
const timeDelay = 200;

export function useLoading(isLoading: boolean){
    const [progress, setProgress] = useState(0);    
    
    useEffect(() => {
        if(!isLoading){            
            return;
        }
        const progressInterval = setInterval(() => {
            setProgress(currentProgress => (currentProgress + (maxValue-currentProgress) * 0.05) )
        }, timeDelay);            
    
        return () => {
            clearInterval(progressInterval);
            setProgress(0);
        }

    }, [isLoading]);

    return isLoading ? progress : 0;
}
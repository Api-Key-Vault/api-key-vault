import { useState, useEffect } from "react";

const maxValue = 91;
const timeDelay = 200;

export function useLoading(isLoading: boolean){
    const [progress, setProgress] = useState(0);    
    
    useEffect(() => {
        let progressInterval = 0;
        if(isLoading){                   
          progressInterval = setInterval(() => {
                setProgress(currentProgress => (currentProgress + (maxValue-currentProgress) * 0.10) )
            }, timeDelay);            
        }
            
        return () => {
            setProgress(100); 
            clearInterval(progressInterval);           
        }

    }, [isLoading]);

    return progress;
}
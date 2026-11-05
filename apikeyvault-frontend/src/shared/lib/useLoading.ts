import { useState, useEffect } from "react";

const maxValue = 91;
const timeDelay = 200;
const finishTimeDelay = 50;
const finishThreshold = 95;

export function useLoading(isLoading: boolean){
    const [progress, setProgress] = useState(0);    
    
    useEffect(() => {        
        if(isLoading){                   
          const progressInterval = setInterval(() => {
                setProgress(currentProgress => (currentProgress + (maxValue-currentProgress) * 0.10))
            }, timeDelay);    

            return () => {
                clearInterval(progressInterval);    
            }        
        } else {
            const secondInterval = setInterval(() => {
                setProgress(currentProgress => {
                    const newProgressValue = currentProgress + (100 - currentProgress) * 0.33;
                    return newProgressValue >= finishThreshold 
                        ? 100
                        : newProgressValue;
                })
            
            }, finishTimeDelay);

            return () => {
                clearInterval(secondInterval);
            }
        }
    }, [isLoading]);

    return Math.round(progress);
}
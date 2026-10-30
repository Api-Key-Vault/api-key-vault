import { ProgressBar as RetroProgressBar } from "pixel-retroui";

type ProgressBarProps = {
    progressValue: number;
    size?: "sm" | "md" | "lg";
    className?: string;
    ariaLabel?: string;
};
export function ProgressBar({
    progressValue,
    size = "sm",
    className = "",
    ariaLabel= "loading"
} : ProgressBarProps) {
    const safeValue = Math.min(Math.max(progressValue, 0), 100);

    function roundDowntoStep(safeValue : number){    
    const valueBy5 = Math.floor(safeValue/5) * 5;
    return valueBy5;
   }    

    return(
        <div role="progressbar" aria-label={ariaLabel} >
            <RetroProgressBar 
                size={size}
                color=" var(--primary-accent)"
                borderColor="var(--border)"
                className={`w-[75%] ${className}`}
                progress={roundDowntoStep(safeValue)}
            />
        </div>
    )
}
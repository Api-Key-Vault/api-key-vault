import { Bubble } from "pixel-retroui";

type ErrorMessageProps = {
    message: string;
};
export function ErrorMessage({ message } : ErrorMessageProps){

    return(
    <Bubble
        className="flex flex-row items-center gap-3 left-0 md:left-1/2 translate-x-0 md:translate-x-1/4 w-80"
        direction="left"
        bg="var(--color-surface-elevated)"
        textColor="var(--color-error)"
        borderColor="var(--color-border)"        
    >
        {/* TODO: lcon here */}
        {message}
    </Bubble>
    )
}

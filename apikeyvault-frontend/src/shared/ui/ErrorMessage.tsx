import { Bubble } from "pixel-retroui";
import { useEffect } from "react";

type ErrorMessageProps = {
    message: string;
    onClose: () => void;
    duration?: number;
};

export function ErrorMessage({ message, onClose, duration = 10000 }: ErrorMessageProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className="fixed z-50 top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 md:w-72">
            <Bubble
                className="flex flex-row items-center gap-3 w-full"
                direction="left"
                bg="var(--color-surface-elevated)"
                textColor="var(--color-error)"
                borderColor="var(--color-border)"
            >
                {/* TODO: Add an error icon here. */}
                {message}
            </Bubble>
        </div>
    );
}

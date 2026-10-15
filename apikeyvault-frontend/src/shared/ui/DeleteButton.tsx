import { Button } from "pixel-retroui";
import type { ReactNode } from "react";

type DeleteButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
};

export default function DeleteButton({
    children,
    onClick,
    className
}: DeleteButtonProps){
    return(
        <Button
			bg="var(--color-error)"
			textColor="var(--color-error-on-color)"
			borderColor="var(--color-border)"
			shadow="var(--color-shadow)"
			onClick={onClick}
			className={`flex items-center justify-center gap-3 ${className ?? ""}`}
		>
			<span className="pixelart-icons-font-trash text-[24px]!" />
			{children}
		</Button>
    );
}

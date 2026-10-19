import { Button } from "pixel-retroui";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
};

export function PrimaryButton({
	children,
	onClick,
	className,
	disabled,
}: PrimaryButtonProps) {
	return (
		<Button
			bg="var(--color-primary-accent)"
			textColor="var(--color-text-on-accent)"
			borderColor="var(--color-border)"
			shadow="var(--color-shadow)"
			onClick={onClick}
			disabled={disabled}
			className={`hover:![--button-custom-bg:var(--color-primary-accent-hover)] ${className}`}
		>
			{children}
		</Button>
	);
}

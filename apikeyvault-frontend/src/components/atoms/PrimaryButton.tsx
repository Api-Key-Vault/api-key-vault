import { Button } from "pixel-retroui";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
};

export default function PrimaryButton({
	children,
	onClick,
	className,
}: PrimaryButtonProps) {
	return (
		<Button
			bg="var(--color-primary-accent)"
			textColor="var(--color-text-on-accent)"
			borderColor="var(--color-border)"
			shadow="var(--color-shadow)"
			onClick={onClick}
			className={`hover:![--button-custom-bg:var(--color-primary-accent-hover)] ${className}`}
		>
			{children}
		</Button>
	);
}

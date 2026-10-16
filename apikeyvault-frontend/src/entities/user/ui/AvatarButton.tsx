import {Button} from "pixel-retroui";

// TODO: Add function to open profile menu.
type AvatarButtonProps = {
    onClick?: () => void;
};

export function AvatarButton({ onClick }: AvatarButtonProps) {
	return (
		<Button
			bg="var(--color-primary-accent)"
			textColor="var(--color-text-on-accent)"
			borderColor="var(--color-border)"
			shadow="var(--color-shadow)"
			onClick={onClick}
			className="px-1! py-0!"
		>
			<span className="pixelart-icons-font-user text-[30px]!" />
		</Button>
	);
}
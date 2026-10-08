import { Button } from "pixel-retroui";
import type {ReactNode} from "react"

type PrimaryButtonProps = {
    children: ReactNode;
    onClick?: () => void;
}

export default function PrimaryButton({children, onClick} : PrimaryButtonProps) {
    return (
        <Button
          bg="var(--color-primary-accent)" 
          textColor="var(--color-text-on-accent)"
          onClick={onClick}
          className="hover:![--button-custom-bg:var(--color-primary-accent-hover)]"
        >
            {children}
        </Button>
    )
}
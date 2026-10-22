import { ROUTE_PATHS } from "@/app/router/paths";
import { Bubble } from "pixel-retroui";
import { useNavigate } from "react-router";

export function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="flex justify-center items-center h-screen">
            <Bubble
                onClick={() => navigate(ROUTE_PATHS.HOME, {replace: true})}
                direction="left"
                bg="var(--color-primary-accent)"
                className="text-center">
                Oops! No keys to be found here. <br></br>
                <span className="font-bold text-text-on-accent">Click me</span> to return home.
            </Bubble>
        </div>
    )
} 
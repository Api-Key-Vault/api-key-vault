import { Button, Card } from "pixel-retroui";

export default function Login() {
    return (
        <section className="flex justify-center items-center w-full min-h-screen">
            <Card
                bg="var(--color-surface)"
                textColor="var(--color-text)"
                borderColor="var(--color-border)"
                shadowColor="var(--color-shadow)"
                className="p-4 text-center">
                <span className="pixelart-icons-font-key text-secondary-accent" />
                <h2 className="text-text">Login</h2>
                <p className="text-text-muted">Welcome back!</p>
                <Button
                    bg="var(--color-primary-accent)"
                    textColor="var(--color-text-on-accent)"
                    borderColor="var(--color-border)"
                    shadow="var(--color-shadow)">
                    <span className="pixelart-icons-font-github text-text-on-accent" />
                    Login with Github
                </Button>
                <p className="text-text-muted">We use your Github account for login. We do not save your password.</p>
            </Card>
        </section>
    )
}
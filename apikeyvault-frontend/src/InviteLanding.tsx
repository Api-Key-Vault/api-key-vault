import Card from "./components/atoms/Card";
import PrimaryButton from "./components/atoms/PrimaryButton";

export default function InviteLanding() {
    return (
        <section className="flex justify-center items-center w-full min-h-screen flex-col gap-10">
            <h1 className="text-4xl! text-primary-accent">You have been invited!</h1>
                <Card className="p-4 text-center w-80 h-80 flex gap-3.5 flex-col">
                    <span className="pixelart-icons-font-key text-secondary-accent text-[40px]!" />
                    <h2 className="text-text text-2xl">Welcome!</h2>
                    {/*TODO: Make sure team name is generated dynamically based on the invite */}
                <p className="text-text-muted">You have been invited to join team: {"TEAM"}</p>
                    {/*TODO: Add function to the button (SIGN IN WITH GITHUB) */}
                    <PrimaryButton className="flex align-middle items-center justify-center gap-5">
                        <span className="pixelart-icons-font-github text-[30px]!" />
                        Login with Github
                    </PrimaryButton>
                    <p className="text-text-muted text-sm">
                        We use your Github account for login. We do not save your password.
                    </p>
                </Card>
            </section>
        );
}
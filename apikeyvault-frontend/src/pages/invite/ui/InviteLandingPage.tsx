import { Bubble } from "pixel-retroui";
import { Card, PrimaryButton } from "@/shared/ui";

export function InviteLandingPage() {
	return (
		<section className="flex justify-center items-center w-full min-h-screen">
			<div className="relative">
				<Bubble
					className="flex flex-row items-center gap-3 absolute -top-30 left-0 md:left-1/2 translate-x-0 md:translate-x-1/4 w-80"
					direction="left"
					bg="var(--color-surface-elevated)"
					textColor="var(--color-text)"
					borderColor="var(--color-border)"
				>
					<span className="pixelart-icons-font-mail text-text text-[30px]!"></span>
					You have been invited!
				</Bubble>
				<Card className="p-4 text-center w-80 h-80 flex gap-3.5 flex-col">
					<span className="pixelart-icons-font-key text-secondary-accent text-[40px]!" />
					<h2 className="text-text text-2xl">Welcome!</h2>
					{/*TODO: Make sure team name is generated dynamically based on the invite */}
					<p className="text-text-muted">
						You have been invited to join team: {"TEAM"}
					</p>
					{/*TODO: Add function to the button (SIGN IN WITH GITHUB) */}
					<PrimaryButton className="flex align-middle items-center justify-center gap-5">
						<span className="pixelart-icons-font-github text-[30px]!" />
						Login with Github
					</PrimaryButton>
					<p className="text-text-muted text-sm">
						We use your Github account for login. We do not save your password.
					</p>
				</Card>
			</div>
		</section>
	);
}

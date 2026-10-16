import { Card, PrimaryButton } from "@/shared/ui";
import { LoginError, loginWithGithub } from "@/features/auth";


export function Login() {
	return (
		
		<section className="flex justify-center items-center w-full min-h-screen">
			<div>				
				<LoginError />					
				
				<Card className="p-4 text-center w-80 h-80 flex gap-3.5 flex-col">
					{/*TODO: Make this arrow into a clickable link navigating user back
						to Welcome Page */}
					<div className="flex flex-col justify-center">
						<span className="pixelart-icons-font-arrow-left text-text text-[35px]! self-start" />
						<span className="pixelart-icons-font-key text-secondary-accent text-[40px]!" />
					</div>
					<h2 className="text-text text-2xl">Login</h2>
					<p className="text-text-muted">Welcome back!</p>
					{/*TODO: Add function to the button (SIGN IN WITH GITHUB) */}
					<PrimaryButton onClick={loginWithGithub} className="flex align-middle items-center justify-center gap-5">
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

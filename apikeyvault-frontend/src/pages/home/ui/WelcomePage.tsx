import { Card, PrimaryButton } from "@/shared/ui";
import { loginWithGithub } from "@/features/auth";
import { LoginError } from "@/features/auth";

export function WelcomePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-4 md:gap-10 px-6 py-6">
      <div className="flex items-center justify-center md:justify-between gap-3 md:gap-0 w-full max-w-3xl">
        <h1 className="text-[20px]! sm:text-2xl! md:text-6xl! leading-tight text-[var(--color-primary-accent)]">
          Welcome to
          <br />
          <span className="font-bold whitespace-nowrap">Api Key Vault!</span>
        </h1>

        <span className="pixelart-icons-font-key text-[75px]! sm:text-[85px]! md:text-[140px]! text-yellow-400 shrink-0 inline-block -rotate-270"></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-10 w-full max-w-3xl">
        <Card className="h-24 md:h-48">
          <div className="flex flex-col h-full p-3">
            <span>1.</span>
            <p className="flex-1 flex items-center justify-center text-center">
              {" "}
              Create a team
            </p>
          </div>
        </Card>

        <Card className="h-24 md:h-48">
          <div className="flex flex-col h-full p-3">
            <span>2.</span>
            <p className="flex-1 flex items-center justify-center text-center">
              Invite your team members
            </p>
          </div>
        </Card>

        <Card className="h-24 md:h-48">
          <div className="flex flex-col h-full p-3">
            <span>3.</span>
            <p className="flex-1 flex items-center justify-center text-center">
              Add API-keys and assign access
            </p>
          </div>
        </Card>
      </div>
      <LoginError />
      <PrimaryButton className="px-8 py-1!" onClick={() => loginWithGithub()}>
        <span className="flex items-center justify-center gap-2 pixelart-icons-font-github text-xl!">
          Sign in with Github
        </span>
      </PrimaryButton>
    </section>
  );
}

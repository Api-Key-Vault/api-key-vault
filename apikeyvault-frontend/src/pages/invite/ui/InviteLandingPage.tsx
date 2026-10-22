import { Bubble } from "pixel-retroui";
import { Card, PrimaryButton, ErrorMessage, Loading } from "@/shared/ui";
import { useSearchParams } from "react-router";
import { loginWithGithub, LoginError, useAuth } from "@/features/auth";
import { useEffect, useState, useRef } from "react";
import { acceptInvite } from "@/features/accept-invite";

export function InviteLandingPage() {
  const [searchParams] = useSearchParams();
 
  const token = searchParams.get("token");

  const [errorMessage, setErrorMessage] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useAuth();
  const attemptedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.status === "authenticated" && token && attemptedTokenRef.current !== token ) {
      attemptedTokenRef.current = token;
      const handleAcceptInvite = async () => {
        try {
          setIsLoading(true);

          const response = await acceptInvite({ token });

          setTeamName(response.teamName);
        } catch {
          setErrorMessage("Failed to accept invitation");
        }
        finally{
          setIsLoading(false);
        }
      };
      handleAcceptInvite();
    }
  }, [state.status, token]);

  if(isLoading){
    return <Loading/>
  }

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
            You have been invited to join team: {teamName}
          </p>

          <LoginError />

          {errorMessage && <ErrorMessage message={errorMessage}/>}

          {state.status === "unauthenticated" && (
            <>
              <PrimaryButton
                className="flex align-middle items-center justify-center gap-5"
                onClick={() => loginWithGithub(token ?? undefined)}
              >
                <span className="pixelart-icons-font-github text-[30px]!" />
                Sign in with Github
              </PrimaryButton>
              <p className="text-text-muted text-sm">
                We use your Github account for login. We do not save your
                password.
              </p>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}

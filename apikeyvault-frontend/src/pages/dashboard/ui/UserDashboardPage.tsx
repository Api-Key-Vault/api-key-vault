import { useEffect, useState } from "react";
import { Card, PrimaryButton } from "@/shared/ui";
import { TeamCard } from "./TeamCard";
import { StatsBox } from "./StatsBox";
import { AvatarButton } from "@/shared/ui/AvatarButton";
import { CreateTeamModal } from "@/features/create-team";
import { AccountModal } from "./AccountModal";
import type { TeamResponse } from "@/features/get-team";
import { getAllTeams } from "@/features/get-team/api/getTeam";
import { useAuth } from "@/features/auth";
import { useNavigate } from "react-router";

export function UserDashboardPage() {
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [userTeams, setUserTeams] = useState<TeamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await getAllTeams();
        setUserTeams(teams);
      } catch {
        setErrorMessage("Failed to fetch teams");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleTeamCreated = (newTeam: TeamResponse) => {
    setUserTeams((prev) => [...prev, newTeam]);
  };

  const totalKeys = userTeams.reduce((sum, team) => sum + team.keys, 0);
  const totalMembers = userTeams.reduce((sum, team) => sum + team.members, 0);

  return (
    <section className="flex flex-col items-center w-full min-h-screen p-8 gap-8">
      {/* HEADERN */}
      <Card className="p-4 w-4/5 flex flex-col gap-5 md:flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-8">
          <span className="pixelart-icons-font-key text-secondary-accent text-[50px]!" />
          <div className="text-left flex flex-col gap-1">
            <h1 className="text-text text-xl md:text-2xl">API Key Vault</h1>
            <p className="text-text-muted text-base md:text-2xl">Your teams</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-6">
          <AvatarButton onClick={() => setIsAccountOpen(true)} />
          <PrimaryButton className="text-xl px-4! py-1!" onClick={logout}>
            Logout
          </PrimaryButton>
        </div>
      </Card>

      {/* STATS BOXES */}
      <div className="flex mt-8 flex-col md:flex-row w-4/5 justify-between items-center">
        <StatsBox
          icon={
            <span className="pixelart-icons-font-users text-text text-[35px]!" />
          }
          count={userTeams.length}
          label={userTeams.length == 1 ? "Team" : "Teams"}
        />

        <StatsBox
          icon={
            <span className="pixelart-icons-font-key text-secondary-accent text-[35px]!" />
          }
          count={totalKeys}
          label={totalKeys == 1 ? "Key" : "Keys"}
        />

        <StatsBox
          icon={
            <span className="pixelart-icons-font-user-plus text-text text-[35px]!" />
          }
          count={totalMembers}
          label={totalMembers == 1 ? "Member" : "Members"}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 w-4/5">
        <h2 className="text-primary-accent text-2xl">Teams</h2>
        <PrimaryButton
          className="text-xl px-4! py-1!"
          onClick={() => setIsCreateTeamOpen(true)}
        >
          Create team
        </PrimaryButton>
      </div>

      <section className="w-4/5">
  {errorMessage || isLoading || userTeams.length === 0 ? (
    <div className="flex justify-center w-full mt-20">
      {errorMessage ? (
        <p className="text-center text-error text-2xl">
          {errorMessage}
        </p>
      ) : isLoading ? (
        <p className="text-center text-text text-2xl">
          Loading teams...
        </p>
      ) : (
        <p className="text-center text-text text-2xl">
          You are not a member of any teams yet.
        </p>
      )}
    </div>
  ) : (
    <div className="flex flex-wrap gap-4 w-full justify-center-safe md:justify-between">
      {userTeams.map((team) => (
        <TeamCard
          key={team.id}
          name={team.name}
          keyCount={team.keys}
          memberCount={team.members}
          onClick={() => navigate(`/team/${team.id}`)}
        />
      ))}
    </div>
  )}
</section>
      {isCreateTeamOpen && (
        <CreateTeamModal
          onClose={() => setIsCreateTeamOpen(false)}
          onTeamCreated={handleTeamCreated}
        />
      )}

      {isAccountOpen && (
        <AccountModal onClose={() => setIsAccountOpen(false)} />
      )}
    </section>
  );
}

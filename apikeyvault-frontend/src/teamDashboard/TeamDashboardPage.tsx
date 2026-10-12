import { useState } from "react";
import Card from "../components/atoms/Card";
import PrimaryButton from "../components/atoms/PrimaryButton";
import AddKeyModal from "./AddKeyModal";
import "./TeamDashboardPage.css";

export type TeamRole = "Owner" | "Member";

type TeamMember = {
  id: number;
  name: string;
  role: TeamRole;
};

type TeamKey = {
  id: number;
  name: string;
  addedAt: string;
  visiblePrefix: string;
  maskedValue: string;
};

export type TeamDashboardData = {
  name: string;
  members: TeamMember[];
  keys: TeamKey[];
};

type TeamDashboardPageProps = {
  role?: TeamRole;
  team?: TeamDashboardData;
};

const mockTeam: TeamDashboardData = {
  name: "Team 1",
  members: [
    { id: 1, name: "You", role: "Owner" },
    { id: 2, name: "Alex", role: "Member" },
    { id: 3, name: "Sam", role: "Member" },
  ],
  keys: [
    {
      id: 1,
      name: "2Hero OpenRouter Key",
      addedAt: "2026-10-07",
      visiblePrefix: "sk",
      maskedValue: "********************",
    },
    {
      id: 2,
      name: "Development API Key",
      addedAt: "2026-10-07",
      visiblePrefix: "ak",
      maskedValue: "********************",
    },
    {
      id: 3,
      name: "Production API Key",
      addedAt: "2026-10-07",
      visiblePrefix: "pk",
      maskedValue: "********************",
    },
  ],
};

function TeamKeyRow({ apiKey, isOwner }: { apiKey: TeamKey; isOwner: boolean }) {
  return (
    <Card
      className="dashboard-card dashboard-key-card dashboard-key-row w-full"
    >
      <div className="grid w-full gap-1 px-3 py-3 min-[600px]:grid-cols-[minmax(0,1fr)_auto] min-[600px]:items-center min-[600px]:gap-x-5">
        <div className="flex min-w-0 items-start gap-2">
          <span
            aria-hidden="true"
            className="pixelart-icons-font-key mt-0 shrink-0 text-xl text-secondary-accent min-[600px]:mt-1"
          />
          <div className="min-w-0 flex-1">
            <p className="dashboard-key-title break-words text-xs leading-tight">{apiKey.name}</p>
            <input
              aria-label={apiKey.name + " masked value"}
              className="dashboard-key-input mt-2 w-full min-w-0"
              readOnly
              type="text"
              value={apiKey.visiblePrefix + apiKey.maskedValue}
            />
          </div>
        </div>

        <div className="dashboard-key-meta flex flex-col items-start gap-1 min-[600px]:items-end">
          <p className="dashboard-key-date text-[8px] leading-none text-text-muted">Added {apiKey.addedAt}</p>
          <div className="dashboard-key-actions flex items-center gap-3">
            <button
              aria-label={"Reveal " + apiKey.name}
              className="icon-button"
              type="button"
            >
              <span aria-hidden="true" className="pixelart-icons-font-eye" />
            </button>
            <button
              aria-label={"Copy " + apiKey.name}
              className="icon-button"
              type="button"
            >
              <span aria-hidden="true" className="pixelart-icons-font-copy" />
            </button>
            {isOwner && (
              <button
                aria-label={"Manage " + apiKey.name}
                className="icon-button"
                type="button"
              >
                <span aria-hidden="true" className="pixelart-icons-font-settings-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function TeamDashboardPage({
  role = "Owner",
  team = mockTeam,
}: TeamDashboardPageProps) {
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const isOwner = role === "Owner";
  const roleLabel = isOwner ? "Owner" : "Member";

  return (
    <main className="dashboard-page min-h-screen text-text">
      <div className="mx-auto w-full max-w-[900px]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <PrimaryButton className="dashboard-button dashboard-nav-button">
            <span aria-hidden="true" className="pixelart-icons-font-arrow-left" />
            <span className="hidden min-[600px]:inline">Back to dashboard</span>
            <span className="min-[600px]:hidden">Back</span>
          </PrimaryButton>
          <PrimaryButton className="dashboard-button dashboard-nav-button">
            <span aria-hidden="true" className="pixelart-icons-font-logout" />
            <span>Logout</span>
          </PrimaryButton>
        </div>

        <Card className="dashboard-card dashboard-team-card flex w-full flex-col gap-3 px-4 py-3 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-lg">{team.name}</h1>
            <div className="mt-1 flex flex-wrap gap-x-8 gap-y-1 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className={
                    isOwner
                      ? "pixelart-icons-font-crown text-secondary-accent"
                      : "pixelart-icons-font-user text-secondary-accent"
                  }
                />
                Your role: {roleLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className="pixelart-icons-font-users text-secondary-accent"
                />
                Members: {team.members.length}
              </span>
            </div>
          </div>
          {isOwner && (
            <button className="dashboard-settings-button self-end min-[600px]:self-auto" type="button">
              Settings
            </button>
          )}
        </Card>

        <div className="dashboard-keys-header mb-3 flex items-center justify-between gap-3 px-1 min-[600px]:mb-6">
          <h2 className="text-base">Keys</h2>
          {isOwner && (
            <PrimaryButton
              className="dashboard-button dashboard-add-key-button"
              onClick={() => setIsAddKeyOpen(true)}
            >
              <span>Add key</span>
            </PrimaryButton>
          )}
        </div>

        <div className="dashboard-key-list flex flex-col gap-3 min-[600px]:gap-5">
          {team.keys.map((apiKey) => (
            <TeamKeyRow apiKey={apiKey} isOwner={isOwner} key={apiKey.id} />
          ))}
        </div>
      </div>

      {isOwner && isAddKeyOpen && (
        <AddKeyModal onClose={() => setIsAddKeyOpen(false)} />
      )}
    </main>
  );
}

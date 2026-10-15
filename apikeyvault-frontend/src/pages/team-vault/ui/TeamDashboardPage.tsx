import { useEffect, useState } from "react";
import { Card, PrimaryButton } from "@/shared/ui";
import { AddKeyModal, type AddKeyRequest } from "@/features/create-api-key";
import { ManageKeyModal, type ManageKeyUpdate } from "@/features/manage-api-key";
import "./TeamDashboardPage.css";
import { TeamSettingsModal } from "@/features/update-team";
import type { ApiKey } from "@/entities/api-key";
import type { Team, TeamRole } from "@/entities/team";

type TeamDashboardData = Team & { keys: ApiKey[] };

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
      demoValue: "sk-demo-openrouter-key",
    },
    {
      id: 2,
      name: "Development API Key",
      addedAt: "2026-10-07",
      visiblePrefix: "ak",
      maskedValue: "********************",
      demoValue: "ak-demo-development-key",
    },
    {
      id: 3,
      name: "Production API Key",
      addedAt: "2026-10-07",
      visiblePrefix: "pk",
      maskedValue: "********************",
      demoValue: "pk-demo-production-key",
    },
  ],
};

type TeamKeyRowProps = {
  apiKey: ApiKey;
  isOwner: boolean;
  onManage: (apiKey: ApiKey) => void;
};

function TeamKeyRow({ apiKey, isOwner, onManage }: TeamKeyRowProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isRevoked = apiKey.isRevoked === true;
  const demoValue = apiKey.demoValue ?? `${apiKey.visiblePrefix}-demo-key`;

  const displayedValue = isRevealed && !isRevoked
    ? demoValue
    : apiKey.visiblePrefix + apiKey.maskedValue;

  useEffect(() => {
    if (!isRevealed || isRevoked) {
      return;
    }

    const timeoutId = window.setTimeout(() => setIsRevealed(false), 5000);

    return () => window.clearTimeout(timeoutId);
  }, [isRevealed, isRevoked]);

  function handleReveal() {
    if (isRevoked) {
      return;
    }

    setIsRevealed((currentValue) => !currentValue);
    setIsCopied(false);
  }

  async function handleCopy() {
    if (isRevoked || !isRevealed) {
      return;
    }

    try {
      await navigator.clipboard.writeText(demoValue);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <Card
      className="dashboard-card dashboard-key-row max-[599px]:relative m-0! w-full border-2! border-border! p-0! shadow-[3px_3px_0_var(--shadow)]!"
    >
      <div className="grid w-full gap-1 px-3 py-3 min-[600px]:grid-cols-[minmax(0,1fr)_auto] min-[600px]:items-center min-[600px]:gap-x-5 min-[900px]:p-4">
        <div className="flex min-w-0 items-start gap-2 max-[599px]:grid! max-[599px]:grid-cols-[auto_minmax(0,1fr)]! max-[599px]:grid-rows-[auto_auto]! max-[599px]:gap-x-2! max-[599px]:gap-y-1.5! max-[599px]:items-center!">
          <span
            aria-hidden="true"
            className="pixelart-icons-font-key shrink-0 text-xl text-secondary-accent max-[599px]:col-start-1! max-[599px]:row-start-1! max-[599px]:text-[18px]! max-[599px]:leading-none! min-[600px]:mt-1 min-[600px]:translate-y-[10px]!"
          />
          <div className="min-w-0 flex-1 max-[599px]:contents!">
            <p className="break-words text-xs! leading-tight! max-[599px]:col-start-2! max-[599px]:row-start-1! min-[900px]:text-base! min-[900px]:leading-tight!">{apiKey.name}</p>
            <input
              aria-label={apiKey.name + (isRevealed && !isRevoked ? " revealed value" : " masked value")}
              className="mt-2 h-[15px]! w-full min-w-0 border! border-border! bg-surface-elevated! px-1! py-px! text-[8px]! leading-none! text-text-muted! outline-none max-[599px]:col-span-full! max-[599px]:row-start-2! max-[599px]:mt-0! min-[900px]:h-6! min-[900px]:px-1.5! min-[900px]:py-[3px]! min-[900px]:text-[11px]!"
              readOnly
              type="text"
              value={displayedValue}
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 max-[599px]:contents min-[600px]:items-end">
          <p className="text-[8px]! leading-none! text-text-muted! max-[599px]:absolute max-[599px]:right-2 max-[599px]:top-[10px] min-[900px]:text-[10px]!">{isRevoked ? "Revoked" : "Added"} {apiKey.addedAt}</p>
          <div className="flex items-center gap-3 max-[599px]:ml-0 max-[599px]:mt-1 min-[600px]:translate-y-[5px]! min-[900px]:translate-y-[7px]!">
            <button
              aria-label={(isRevealed ? "Hide " : "Reveal ") + apiKey.name}
              className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:[transform:translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 max-[599px]:h-[18px]! max-[599px]:w-[18px]! min-[900px]:h-5! min-[900px]:w-5!"
              disabled={isRevoked || !isRevealed}
              onClick={handleReveal}
              type="button"
            >
              <span aria-hidden="true" className="pixelart-icons-font-eye text-[14px]! leading-none! max-[599px]:text-[16px]! min-[900px]:text-[18px]!" />
            </button>
            <button
              aria-label={(isCopied ? "Copied " : "Copy ") + apiKey.name}
              className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:[transform:translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 max-[599px]:h-[18px]! max-[599px]:w-[18px]! min-[900px]:h-5! min-[900px]:w-5!"
              onClick={() => void handleCopy()}
              disabled={isRevoked}
              title={isCopied ? "Copied" : "Copy API key"}
              type="button"
            >
              <span aria-hidden="true" className="pixelart-icons-font-copy text-[14px]! leading-none! max-[599px]:text-[16px]! min-[900px]:text-[18px]!" />
            </button>
            {isOwner && (
              <button
                aria-label={"Manage " + apiKey.name}
                className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:[transform:translateY(2px)]! max-[599px]:h-[18px]! max-[599px]:w-[18px]! min-[900px]:h-5! min-[900px]:w-5!"
                onClick={() => onManage(apiKey)}
                type="button"
              >
                <span aria-hidden="true" className="pixelart-icons-font-settings-2 text-[14px]! leading-none! max-[599px]:text-[16px]! min-[900px]:text-[18px]!" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function TeamDashboardPage({
  role = "Member",
  team = mockTeam,
}: TeamDashboardPageProps) {
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [keys, setKeys] = useState(team.keys);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [teamData, setTeamData] = useState(team);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isOwner = role === "Owner";
  const roleLabel = isOwner ? "Owner" : "Member";

  function showToast(message: string) {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2500);
  }

  function handleAddKey(request: AddKeyRequest) {
    const demoValue = request.value;
    const visiblePrefix = demoValue.slice(0, 2).padEnd(2, "*");

    setKeys((currentKeys) => [
      ...currentKeys,
      {
        id: Math.max(0, ...currentKeys.map((key) => key.id)) + 1,
        name: request.name,
        addedAt: new Date().toISOString().slice(0, 10),
        visiblePrefix,
        maskedValue: "*".repeat(Math.max(20, demoValue.length)),
        demoValue,
        category: request.category || undefined,
        expiresAt: request.expiresAt || undefined,
      },
    ]);

    setIsAddKeyOpen(false);
    showToast("API key added");
  }

  function handleSaveKey(update: ManageKeyUpdate) {
    if (selectedKey === null) {
      return;
    }

    setKeys((currentKeys) => currentKeys.map((key) => {
      if (key.id !== selectedKey.id) {
        return key;
      }

      if (update.value.length === 0) {
        return {
          ...key,
          name: update.name,
          category: update.category || undefined,
          expiresAt: update.expiresAt || undefined,
        };
      }

      return {
        ...key,
        name: update.name,
        category: update.category || undefined,
        expiresAt: update.expiresAt || undefined,
        visiblePrefix: update.value.slice(0, 2).padEnd(2, "*"),
        maskedValue: "*".repeat(Math.max(20, update.value.length)),
        demoValue: update.value,
      };
    }));

    setSelectedKey(null);
    showToast("API key updated");
  }

  function handleRevokeKey() {
    if (selectedKey === null) {
      return;
    }

    setKeys((currentKeys) => currentKeys.map((key) => (
      key.id === selectedKey.id ? { ...key, isRevoked: true } : key
    )));
    setSelectedKey(null);
    showToast("API key revoked");
  }

  function handleSaveTeamName(name: string) {
    if (name.length === 0) {
      return;
    }

    setTeamData((currentTeam) => ({ ...currentTeam, name }));
    setIsSettingsOpen(false);
    showToast("Team name updated");
  }

  return (
    <main className="min-h-screen p-4! text-text min-[600px]:px-12! min-[600px]:pb-5! min-[600px]:pt-[22px]!">
      <div className="mx-auto w-full max-w-[900px]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <PrimaryButton className="m-0! inline-flex! h-[19px]! min-h-[19px]! items-center justify-center gap-2 whitespace-nowrap border! border-border! px-1.5! py-0.5! text-[10px]! leading-none! shadow-[2px_2px_0_var(--shadow)]! min-[900px]:h-[26px]! min-[900px]:min-h-[26px]! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!">
            <span aria-hidden="true" className="pixelart-icons-font-arrow-left text-[10px]! leading-none! min-[900px]:text-[15px]!" />
            <span className="hidden min-[600px]:inline">Back to dashboard</span>
            <span className="min-[600px]:hidden">Back</span>
          </PrimaryButton>
          <PrimaryButton className="m-0! inline-flex! h-[19px]! min-h-[19px]! items-center justify-center gap-2 whitespace-nowrap border! border-border! px-1.5! py-0.5! text-[10px]! leading-none! shadow-[2px_2px_0_var(--shadow)]! min-[900px]:h-[26px]! min-[900px]:min-h-[26px]! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!">
            <span aria-hidden="true" className="pixelart-icons-font-logout text-[10px]! leading-none! min-[900px]:text-[15px]!" />
            <span>Logout</span>
          </PrimaryButton>
        </div>

        <Card className="dashboard-card m-0! mb-5! flex w-full flex-col gap-3 border-2! border-border! px-4 pb-5! pt-3! shadow-[5px_5px_0_var(--shadow)]! min-[600px]:mb-6! min-[600px]:min-h-[62px] min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between min-[900px]:mb-8! min-[900px]:min-h-[88px] min-[900px]:pb-7! min-[900px]:pt-[18px]!
        ">
          <div className="min-w-0">
            <h1 className="truncate text-lg min-[900px]:text-2xl! min-[900px]:leading-tight!">{teamData.name}</h1>
            <div className="mt-1 flex flex-wrap gap-x-8 gap-y-1 text-xs text-text-muted min-[900px]:mt-2! min-[900px]:text-sm!">
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className={
                    isOwner
                      ? "pixelart-icons-font-crown text-secondary-accent text-[14px]! leading-none! min-[900px]:text-lg!"
                      : "pixelart-icons-font-user text-secondary-accent text-[14px]! leading-none! min-[900px]:text-lg!"
                  }
                />
                Your role: {roleLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className="pixelart-icons-font-users text-secondary-accent text-[14px]! leading-none! min-[900px]:text-lg!"
                />
                Members: {teamData.members.length}
              </span>
            </div>
          </div>
          {isOwner && (
            <button className="inline-flex! h-5! cursor-pointer items-center justify-center self-end border! border-border! bg-surface-elevated! px-1.5! py-0.5! text-[10px]! leading-none! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:bg-surface active:[transform:translateY(2px)]! min-[600px]:self-auto min-[900px]:h-[26px]! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!" onClick={() => setIsSettingsOpen(true)} type="button">
              Settings
            </button>
          )}
        </Card>

        <div className="mb-3 flex items-center justify-between gap-3 px-1 min-[600px]:mb-6 min-[900px]:mb-8!">
          <h2 className="text-base! text-primary-accent! min-[900px]:text-xl! min-[900px]:leading-tight!">Keys</h2>
          {isOwner && (
            <PrimaryButton
              className="m-0! inline-flex h-[23px]! min-h-[23px]! items-center justify-center gap-1 whitespace-nowrap border-2! border-border! px-1.5! py-[3px]! text-[10px]! leading-none! shadow-[0_4px_4px_rgba(0,0,0,0.25)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
              onClick={() => setIsAddKeyOpen(true)}
            >
              <span>Add key</span>
            </PrimaryButton>
          )}
        </div>

        {keys.length === 0 ? (
          <Card className="dashboard-card m-0! border-2! border-border! p-5! text-center text-[12px]! text-text-muted! shadow-[3px_3px_0_var(--shadow)]!">
            No API keys have been added yet.
          </Card>
        ) : (
          <div className="flex flex-col gap-3 min-[600px]:gap-5 min-[900px]:gap-6">
            {keys.map((apiKey) => (
              <TeamKeyRow apiKey={apiKey} isOwner={isOwner} key={apiKey.id} onManage={setSelectedKey} />
            ))}
          </div>
        )}
      </div>

      {isOwner && isAddKeyOpen && (
        <AddKeyModal onAdd={handleAddKey} onClose={() => setIsAddKeyOpen(false)} />
      )}

      {isOwner && selectedKey !== null && (
        <ManageKeyModal
          apiKey={selectedKey}
          onClose={() => setSelectedKey(null)}
          onRevoke={handleRevokeKey}
          onSave={handleSaveKey}
        />
      )}

      {isOwner && isSettingsOpen && (
        <TeamSettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onSaveName={handleSaveTeamName}
          team={teamData}
        />
      )}

      {toastMessage !== null && (
        <div
          aria-live="polite"
          className="fixed inset-x-0 bottom-4 z-[60] mx-auto w-fit max-w-[calc(100%-2rem)] border-2! border-border! bg-surface-elevated! px-3! py-2! text-center text-[11px]! text-text! shadow-[3px_3px_0_var(--shadow)]!"
          role="status"
        >
          {toastMessage}
        </div>
      )}
    </main>
  );
}

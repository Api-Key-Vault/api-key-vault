import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AddKeyModal, type AddKeyRequest } from "@/features/create-api-key";
import { ManageKeyModal, type ManageKeyUpdate } from "@/features/manage-api-key";
import { useAuth } from "@/features/auth";
import {
  createApiKey,
  getApiKeys,
  revealApiKey,
  revokeApiKey,
  updateApiKey,
  type ApiKey,
} from "@/entities/api-key";
import {
  getTeam,
  getTeamMembers,
  type Team,
  type TeamMember,
} from "@/entities/team";
import { Card, PrimaryButton } from "@/shared/ui";
import { ROUTE_PATHS } from "@/app/router/paths";
import { TeamSettingsModal } from "@/features/update-team";
import "./TeamDashboardPage.css";
import { Button } from "pixel-retroui";

const MASKED_API_KEY = "••••••••••••••••";
const MAX_TIMEOUT_MS = 2_147_483_647;
const COPY_FEEDBACK_TIMEOUT_MS = 5000;

function normaliseExpiry(value: string): string | null {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return `${trimmedValue}T00:00:00.000Z`;
  }

  return trimmedValue;
}

function parseUtcDate(value: string): Date {
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  return new Date(hasTimezone ? value : `${value}Z`);
}

function hasExpired(value: string | null): boolean {
  if (value === null || value.length === 0) {
    return false;
  }

  const expiry = parseUtcDate(value);
  return !Number.isNaN(expiry.getTime()) && expiry.getTime() <= Date.now();
}

function formatDate(value: string | null): string {
  if (value === null || value.length === 0) {
    return "No expiry";
  }

  const date = parseUtcDate(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString();
}

type CopyFeedback = {
  keyId: number;
};

type TeamKeyRowProps = {
  apiKey: ApiKey;
  isCopied: boolean;
  isBusy: boolean;
  isOwner: boolean;
  teamId: number;
  onCopy: (apiKey: ApiKey, isRowValid: () => boolean) => Promise<string | null>;
  onCopyReset: (apiKeyId: number) => void;
  onManage: (apiKey: ApiKey) => void;
};

function TeamKeyRow({
  apiKey,
  isCopied,
  isBusy,
  isOwner,
  teamId,
  onCopy,
  onCopyReset,
  onManage,
}: TeamKeyRowProps) {
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [isKeyActionPending, setIsKeyActionPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocallyExpired, setIsLocallyExpired] = useState(() => hasExpired(apiKey.expiresAt));
  const mountedRef = useRef(false);
  const isInactive = apiKey.status !== "Active" || isLocallyExpired;
  const isPending = isKeyActionPending || isBusy;
  const isRevealed = revealedValue !== null;
  const displayedStatus = isLocallyExpired && apiKey.status === "Active" ? "Expired" : apiKey.status;

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      onCopyReset(apiKey.id);
    };
  }, [apiKey.id, onCopyReset]);

  useEffect(() => {
    if (apiKey.expiresAt === null) {
      return;
    }

    const expiry = parseUtcDate(apiKey.expiresAt);
    if (Number.isNaN(expiry.getTime())) {
      return;
    }

    let timeoutId: number;
    const expireKey = () => {
      const remainingTime = expiry.getTime() - Date.now();

      if (remainingTime > 0) {
        timeoutId = window.setTimeout(expireKey, Math.min(remainingTime, MAX_TIMEOUT_MS));
        return;
      }

      if (mountedRef.current) {
        setIsLocallyExpired(true);
        setIsKeyActionPending(false);
        setRevealedValue(null);
        onCopyReset(apiKey.id);
        setErrorMessage(null);
      }
    };

    timeoutId = window.setTimeout(expireKey, Math.min(Math.max(0, expiry.getTime() - Date.now()), MAX_TIMEOUT_MS));

    return () => window.clearTimeout(timeoutId);
  }, [apiKey.expiresAt, apiKey.id, onCopyReset]);

  useEffect(() => {
    if (revealedValue === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (mountedRef.current) {
        setRevealedValue(null);
        setErrorMessage(null);
      }
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [revealedValue]);

  async function handleReveal() {
    if (isInactive || hasExpired(apiKey.expiresAt) || isPending) {
      return;
    }

    if (isRevealed) {
      setRevealedValue(null);
      setErrorMessage(null);
      return;
    }

    setIsKeyActionPending(true);
    setErrorMessage(null);

    try {
      const response = await revealApiKey(teamId, apiKey.id);

      if (!mountedRef.current) {
        return;
      }

      if (hasExpired(apiKey.expiresAt)) {
        setIsLocallyExpired(true);
        setRevealedValue(null);
        onCopyReset(apiKey.id);
        return;
      }

      if (typeof response.value !== "string" || response.value.length === 0) {
        setRevealedValue(null);
        setErrorMessage("The API key could not be revealed.");
        return;
      }

      setRevealedValue(response.value);
    } catch {
      if (mountedRef.current && !hasExpired(apiKey.expiresAt)) {
        setRevealedValue(null);
        setErrorMessage("The API key could not be revealed.");
      }
    } finally {
      if (mountedRef.current) {
        setIsKeyActionPending(false);
      }
    }
  }

  async function handleCopy() {
    if (isInactive || hasExpired(apiKey.expiresAt) || isPending || !navigator.clipboard) {
      return;
    }

    setIsKeyActionPending(true);
    setErrorMessage(null);

    try {
      const copyError = await onCopy(apiKey, () => (
        mountedRef.current
        && apiKey.status === "Active"
        && !isLocallyExpired
        && !hasExpired(apiKey.expiresAt)
      ));

      if (mountedRef.current && copyError !== null) {
        setErrorMessage(copyError);
      }
    } finally {
      if (mountedRef.current) {
        setIsKeyActionPending(false);
      }
    }
  }

  const displayedValue = revealedValue ?? MASKED_API_KEY;
  const statusClass = displayedStatus === "Active" ? "text-primary-accent" : "text-error";

  return (
    <Card className="dashboard-card dashboard-key-row max-[599px]:relative m-0! w-full border-2! border-border! p-0! shadow-[3px_3px_0_var(--shadow)]!">
      <div className="grid w-full gap-1 px-3 py-3 min-[600px]:grid-cols-[minmax(0,1fr)_auto] min-[600px]:items-center min-[600px]:gap-x-5 min-[600px]:gap-y-2 min-[900px]:p-4">
        <div className="flex min-w-0 items-start gap-2 max-[599px]:grid! max-[599px]:grid-cols-[auto_minmax(0,1fr)]! max-[599px]:grid-rows-[auto_auto]! max-[599px]:gap-x-2! max-[599px]:gap-y-1.5! max-[599px]:items-center!">
          <span
            aria-hidden="true"
            className="pixelart-icons-font-key shrink-0 text-xl text-secondary-accent max-[599px]:col-start-1! max-[599px]:row-start-1! max-[599px]:text-[18px]! max-[599px]:leading-none! min-[600px]:mt-1 min-[600px]:translate-y-2.5!"
          />
          <div className="min-w-0 flex-1 max-[599px]:contents!">
            <p className="wrap-break-word text-xs! leading-tight! max-[599px]:col-start-2! max-[599px]:row-start-1! max-[599px]:pr-33! min-[900px]:text-base! min-[900px]:leading-tight!">{apiKey.name}</p>
            <p className="mt-1 wrap-break-word text-[9px]! leading-tight! text-text-muted! max-[599px]:col-span-full! max-[599px]:row-start-2! max-[599px]:mt-0! max-[599px]:pr-33! min-[900px]:text-[11px]!">
              {apiKey.category ?? "Uncategorized"}
            </p>
            <input
              aria-label={apiKey.name + (isRevealed ? " revealed value" : " masked value")}
              className="mt-2 h-3.75! w-full min-w-0 border! border-border! bg-surface-elevated! px-1! py-px! text-[8px]! leading-none! text-text-muted! outline-none max-[599px]:col-span-full! max-[599px]:row-start-3! max-[599px]:mt-0! min-[900px]:h-6! min-[900px]:px-1.5! min-[900px]:py-0.75! min-[900px]:text-[11px]!"
              readOnly
              type="text"
              value={displayedValue}
            />
            {errorMessage !== null && (
              <p className="mt-1 text-[9px]! leading-tight! text-error! max-[599px]:col-span-full! max-[599px]:row-start-4!">{errorMessage}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 max-[599px]:contents min-[600px]:items-end">
          <div className="contents max-[599px]:absolute max-[599px]:right-2 max-[599px]:top-2.5 max-[599px]:flex max-[599px]:max-w-33! max-[599px]:flex-col max-[599px]:items-end">
            <p className={`text-[8px]! leading-tight! max-[599px]:text-right! min-[900px]:text-[10px]! ${statusClass}`}>
              {displayedStatus} · {apiKey.expiresAt === null ? "No expiry" : `Expires ${formatDate(apiKey.expiresAt)}`}
            </p>
            <p className="text-[8px]! leading-tight! text-text-muted! max-[599px]:text-right!">
              Added {formatDate(apiKey.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3 max-[599px]:ml-0 max-[599px]:mt-1 min-[600px]:translate-y-1.25! min-[900px]:translate-y-1.75!">
            <button
              aria-label={(isRevealed ? "Hide " : "Reveal ") + apiKey.name}
              className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:transform-[translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 max-[599px]:h-4.5! max-[599px]:w-4.5! min-[900px]:h-5! min-[900px]:w-5!"
              disabled={isInactive || isPending}
              onClick={handleReveal}
              type="button"
            >
              <span aria-hidden="true" className={`${isRevealed ? "pixelart-icons-font-eye-off" : "pixelart-icons-font-eye"} text-[14px]! leading-none! max-[599px]:text-[16px]! min-[900px]:text-[18px]!`} />
            </button>
            <button
              aria-label={(isCopied ? "Copied " : "Copy ") + apiKey.name}
              className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:transform-[translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 max-[599px]:h-4.5! max-[599px]:w-4.5! min-[900px]:h-5! min-[900px]:w-5!"
              disabled={isInactive || isPending}
              onClick={() => void handleCopy()}
              title={isCopied ? "Copied" : "Copy API key"}
              type="button"
            >
              <span aria-hidden="true" className={`${isCopied ? "pixelart-icons-font-check" : "pixelart-icons-font-copy"} text-[14px]! leading-none! max-[599px]:text-[16px]! min-[900px]:text-[18px]!`} />
            </button>
            {isOwner && (
              <button
                aria-label={"Manage " + apiKey.name}
                className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:transform-[translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 max-[599px]:h-4.5! max-[599px]:w-4.5! min-[900px]:h-5! min-[900px]:w-5!"
                disabled={isBusy}
                onClick={() => onManage(apiKey)}
                type="button"
              >
                <span aria-hidden="true" className="pixelart-icons-font-settings-cog text-[14px]! leading-none! max-[599px]:text-[16px]! min-[900px]:text-[18px]!" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

type TeamDashboardContentProps = {
  authUserId: string | null;
  hasValidTeamId: boolean;
  onBack: () => void;
  onRetry: () => void;
  teamId: number;
};

export function TeamDashboardPage() {
  const navigate = useNavigate();
  const { teamId: teamIdParam } = useParams<{ teamId: string }>();
  const { state: authState } = useAuth();
  const authUserId = authState.status === "authenticated" ? authState.user.id : null;
  const teamId = Number(teamIdParam);
  const hasValidTeamId = Number.isInteger(teamId) && teamId > 0;
  const [loadAttempt, setLoadAttempt] = useState(0);

  return (
    <TeamDashboardContent
      authUserId={authUserId}
      hasValidTeamId={hasValidTeamId}
      key={`${hasValidTeamId ? teamId : "invalid"}:${authUserId ?? "anonymous"}:${loadAttempt}`}
      onBack={() => navigate(ROUTE_PATHS.DASHBOARD)}
      onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
      teamId={teamId}
    />
  );
}

function TeamDashboardContent({
  authUserId,
  hasValidTeamId,
  onBack,
  onRetry,
  teamId,
}: TeamDashboardContentProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [copiedFeedback, setCopiedFeedback] = useState<CopyFeedback | null>(null);
  const mountedRef = useRef(false);

  const currentMember = members.find((member) => member.userId === authUserId);
  const isOwner = currentMember?.roleName === "Owner";
  const roleLabel = currentMember?.roleName ?? (isLoading ? "Loading..." : "Unknown");

  const clearCopyForKey = useCallback((apiKeyId: number) => {
    if (mountedRef.current) {
      setCopiedFeedback((current) => current?.keyId === apiKeyId ? null : current);
    }
  }, []);

  async function handleCopyKey(apiKey: ApiKey, isRowValid: () => boolean): Promise<string | null> {
    if (!mountedRef.current || !isRowValid()) {
      return null;
    }

    if (!navigator.clipboard) {
      return "The API key could not be copied.";
    }

    setCopiedFeedback(null);

    let response: { value: string };
    try {
      response = await revealApiKey(teamId, apiKey.id);
    } catch {
      return mountedRef.current && isRowValid() ? "The API key could not be revealed." : null;
    }

    if (!mountedRef.current || !isRowValid()) {
      return null;
    }

    if (typeof response.value !== "string" || response.value.length === 0) {
      return "The API key could not be revealed.";
    }

    try {
      await navigator.clipboard.writeText(response.value);
    } catch {
      return mountedRef.current && isRowValid()
        ? "The API key could not be copied."
        : null;
    }

    if (!mountedRef.current || !isRowValid()) {
      return null;
    }

    setCopiedFeedback({ keyId: apiKey.id });
    return null;
  }

  useEffect(() => {
    if (copiedFeedback === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedFeedback((current) => current === copiedFeedback ? null : current);
    }, COPY_FEEDBACK_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [copiedFeedback]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!hasValidTeamId || authUserId === null) {
      return;
    }

    Promise.all([getTeam(teamId), getTeamMembers(teamId), getApiKeys(teamId)])
      .then(([loadedTeam, loadedMembers, loadedKeys]) => {
        if (cancelled) {
          return;
        }

        setTeam(loadedTeam);
        setMembers(loadedMembers);
        setKeys(loadedKeys);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setLoadError("The team could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authUserId, hasValidTeamId, teamId]);

  async function handleAddKey(request: AddKeyRequest) {
    if (!isOwner || !hasValidTeamId || isMutating) {
      return;
    }

    const { category, name, value } = request;

    setIsMutating(true);
    setModalError(null);

    try {
      const createdKey = await createApiKey(teamId, {
        name,
        value,
        category: category || null,
        expiresAt: normaliseExpiry(request.expiresAt),
      });

      if (!mountedRef.current) {
        return;
      }

      setKeys((currentKeys) => [...currentKeys, createdKey]);
      setIsAddKeyOpen(false);
    } catch {
      if (mountedRef.current) {
        setModalError("The API key could not be added.");
      }
    } finally {
      if (mountedRef.current) {
        setIsMutating(false);
      }
    }
  }

  async function handleSaveKey(update: ManageKeyUpdate) {
    if (!isOwner || !hasValidTeamId || selectedKey === null || isMutating) {
      return;
    }

    const selectedKeyId = selectedKey.id;
    const { category, expiresAt, name, value } = update;

    setIsMutating(true);
    setModalError(null);

    try {
      const updatedKey = await updateApiKey(teamId, selectedKeyId, {
        name,
        value: value || null,
        category: category || null,
        expiresAt: normaliseExpiry(expiresAt),
      });

      if (!mountedRef.current) {
        return;
      }

      setKeys((currentKeys) => currentKeys.map((key) => (
        key.id === selectedKeyId ? updatedKey : key
      )));
      setSelectedKey(null);
    } catch {
      if (mountedRef.current) {
        setModalError("The API key could not be updated.");
      }
    } finally {
      if (mountedRef.current) {
        setIsMutating(false);
      }
    }
  }

  async function handleRevokeKey() {
    if (!isOwner || !hasValidTeamId || selectedKey === null || isMutating) {
      return;
    }

    const selectedKeyId = selectedKey.id;
    setIsMutating(true);
    setModalError(null);

    try {
      await revokeApiKey(teamId, selectedKeyId);

      if (!mountedRef.current) {
        return;
      }

      setSelectedKey(null);

      try {
        const latestKeys = await getApiKeys(teamId);
        if (!mountedRef.current) {
          return;
        }

        setKeys(latestKeys);
      } catch {
        if (mountedRef.current) {
          setLoadError("The API key was deactivated, but the key list could not be refreshed. Please retry.");
        }
      }
    } catch {
      if (mountedRef.current) {
        setModalError("The API key could not be revoked.");
      }
    } finally {
      if (mountedRef.current) {
        setIsMutating(false);
      }
    }
  }

  function handleOpenAddKey() {
    setModalError(null);
    setIsAddKeyOpen(true);
  }

  function handleCloseAddKey() {
    if (!isMutating) {
      setIsAddKeyOpen(false);
    }
  }

  function handleSelectKey(apiKey: ApiKey) {
    setModalError(null);
    setSelectedKey(apiKey);
  }

  const renderStatusCard = (message: string, canRetry: boolean) => (
    <div role="alert">
      <Card className="dashboard-card m-0! border-2! border-border! p-5! text-center text-[12px]! text-text-muted! shadow-[3px_3px_0_var(--shadow)]!">
        <p>{message}</p>
        {canRetry && (
          <PrimaryButton
            className="mx-auto! mt-4! inline-flex! h-6! min-h-6! items-center justify-center border-2! border-border! px-2! py-1! text-[10px]! shadow-[2px_2px_0_var(--shadow)]!"
            onClick={onRetry}
          >
            Retry
          </PrimaryButton>
        )}
      </Card>
    </div>
  );

  return (
    <main className="min-h-screen p-4! text-text min-[600px]:px-12! min-[600px]:pb-5! min-[600px]:pt-5.5!">
      <div className="mx-auto w-full max-w-225">
        <div className="mb-5 flex items-center justify-between gap-3 px-1.5">
          <PrimaryButton
            className="m-0! inline-flex! h-4.75! min-h-4.75! items-center justify-center gap-2 whitespace-nowrap px-1.5! py-0.5! text-[10px]! leading-none! min-[900px]:h-6.5! min-[900px]:min-h-6.5! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!"
            onClick={onBack}
          >
            <span aria-hidden="true" className="pixelart-icons-font-arrow-left text-[10px]! leading-none! min-[900px]:text-[15px]!" />
            <span className="hidden min-[600px]:inline">Back to dashboard</span>
            <span className="min-[600px]:hidden">Back</span>
          </PrimaryButton>
          <PrimaryButton className="m-0! inline-flex! h-4.75! min-h-4.75! items-center justify-center gap-2 whitespace-nowrap px-1.5! py-0.5! text-[10px]! leading-none! min-[900px]:h-6.5! min-[900px]:min-h-6.5! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!">
            <span aria-hidden="true" className="pixelart-icons-font-logout text-[10px]! leading-none! min-[900px]:text-[15px]!" />
            <span>Logout</span>
          </PrimaryButton>
        </div>

        {!hasValidTeamId ? (
          renderStatusCard("That team URL is invalid.", false)
        ) : authUserId === null ? (
          renderStatusCard("You need to sign in before opening a team.", false)
        ) : loadError !== null ? (
          renderStatusCard(loadError, true)
        ) : isLoading && team === null ? (
          renderStatusCard("Loading team…", false)
        ) : team === null ? (
          renderStatusCard("The team could not be loaded.", true)
        ) : (
          <>
            <Card className="m-0! mb-5! flex w-full flex-col gap-3 px-4 pb-5! pt-3! min-[600px]:mb-6! min-[600px]:min-h-15.5 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between min-[900px]:mb-8! min-[900px]:min-h-22 min-[900px]:pb-7! min-[900px]:pt-4.5!">
              <div className="min-w-0">
                <h1 className="truncate text-lg min-[900px]:text-2xl! min-[900px]:leading-tight!">{team.name}</h1>
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
                    <span aria-hidden="true" className="pixelart-icons-font-users text-secondary-accent text-[14px]! leading-none! min-[900px]:text-lg!" />
                    Members: {members.length}
                  </span>
                </div>
              </div>
              {isOwner && (
                  <Button
                    bg="var(--color-surface-elevated)"
                    className="inline-flex! h-5! cursor-pointer items-center justify-center px-1.5! py-0.5! text-[10px]! text-text! min-[600px]:self-auto min-[900px]:h-6.5! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                  Settings
                </Button>
              )}
            </Card>

            <div className="mb-3 flex items-center justify-between gap-3 pl-1 pr-1.5 min-[600px]:mb-6 min-[900px]:mb-8!">
              <h2 className="text-base! text-primary-accent! min-[900px]:text-xl! min-[900px]:leading-tight!">Keys</h2>
              {isOwner && (
                <PrimaryButton
                  className="m-0! inline-flex h-5.75! min-h-5.75! items-center justify-center gap-1 whitespace-nowrap px-1.5! py-0.75! text-[10px]! leading-none! min-[900px]:h-7.25! min-[900px]:min-h-7.25! min-[900px]:px-2.5! min-[900px]:py-1.25! min-[900px]:text-[13px]!"
                  onClick={handleOpenAddKey}
                >
                  <span>Add key</span>
                </PrimaryButton>
              )}
            </div>

            {keys.length === 0 ? (
              <Card className="m-0! p-5! text-center text-[12px]! text-text-muted!">
                No API keys have been added yet.
              </Card>
            ) : (
              <div className="flex flex-col gap-3 min-[600px]:gap-5 min-[900px]:gap-6">
                {keys.map((apiKey) => (
                  <TeamKeyRow
                    apiKey={apiKey}
                    isCopied={copiedFeedback?.keyId === apiKey.id}
                    isBusy={isMutating}
                    isOwner={isOwner}
                    key={apiKey.id}
                    onCopy={handleCopyKey}
                    onCopyReset={clearCopyForKey}
                    onManage={handleSelectKey}
                    teamId={teamId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isOwner && isAddKeyOpen && (
        <AddKeyModal onAdd={handleAddKey} onClose={handleCloseAddKey} error={modalError} isSubmitting={isMutating} />
      )}

      {isOwner && selectedKey !== null && (
        <ManageKeyModal
          apiKey={selectedKey}
          error={modalError}
          isSubmitting={isMutating}
          onClose={() => {
            if (!isMutating) {
              setSelectedKey(null);
            }
          }}
          onRevoke={handleRevokeKey}
          onSave={handleSaveKey}
        />
      )}

      {isOwner && isSettingsOpen && team !== null && (
        <TeamSettingsModal
          onClose={() => setIsSettingsOpen(false)}
          team={{ name: team.name, members }}
        />
      )}
    </main>
  );
}

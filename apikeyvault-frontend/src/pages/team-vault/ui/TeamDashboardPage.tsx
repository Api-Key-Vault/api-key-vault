import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
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

const MASKED_API_KEY = "••••••••••••••••";
const MAX_TIMEOUT_MS = 2_147_483_647;

function getResponseStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  return error.response?.status;
}

function getSafeErrorMessage(error: unknown, fallback: string): string {
  switch (getResponseStatus(error)) {
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You do not have permission to access this team.";
    case 404:
      return "The requested team or API key could not be found.";
    case 409:
      return "This API key cannot be changed in its current state.";
    default:
      return fallback;
  }
}

function getRevealErrorMessage(error: unknown): string {
  switch (getResponseStatus(error)) {
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You do not have permission to reveal this API key.";
    case 404:
      return "This API key is no longer available.";
    case 409:
      return "This API key is expired or revoked and cannot be revealed.";
    default:
      return "The API key could not be revealed.";
  }
}

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

type TeamKeyRowProps = {
  apiKey: ApiKey;
  isBusy: boolean;
  isOwner: boolean;
  teamId: number;
  onManage: (apiKey: ApiKey) => void;
};

function TeamKeyRow({ apiKey, isBusy, isOwner, teamId, onManage }: TeamKeyRowProps) {
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [isRevealPending, setIsRevealPending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocallyExpired, setIsLocallyExpired] = useState(() => hasExpired(apiKey.expiresAt));
  const requestVersionRef = useRef(0);
  const mountedRef = useRef(false);
  const isInactive = apiKey.status !== "Active" || isLocallyExpired;
  const isPending = isRevealPending || isBusy;
  const isRevealed = revealedValue !== null;
  const displayedStatus = isLocallyExpired && apiKey.status === "Active" ? "Expired" : apiKey.status;

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestVersionRef.current += 1;
    };
  }, []);

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
        requestVersionRef.current += 1;
        setIsLocallyExpired(true);
        setIsRevealPending(false);
        setRevealedValue(null);
        setIsCopied(false);
        setErrorMessage(null);
      }
    };

    timeoutId = window.setTimeout(expireKey, Math.min(Math.max(0, expiry.getTime() - Date.now()), MAX_TIMEOUT_MS));

    return () => window.clearTimeout(timeoutId);
  }, [apiKey.expiresAt]);

  useEffect(() => {
    if (revealedValue === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (mountedRef.current) {
        requestVersionRef.current += 1;
        setRevealedValue(null);
        setIsCopied(false);
      }
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [revealedValue]);

  async function requestReveal(): Promise<{ value: string; version: number } | null> {
    if (isInactive || hasExpired(apiKey.expiresAt) || isPending) {
      return null;
    }

    const requestVersion = ++requestVersionRef.current;
    setIsRevealPending(true);
    setIsCopied(false);
    setErrorMessage(null);

    try {
      const response = await revealApiKey(teamId, apiKey.id);

      if (!mountedRef.current || requestVersion !== requestVersionRef.current) {
        return null;
      }

      if (hasExpired(apiKey.expiresAt)) {
        setIsLocallyExpired(true);
        setRevealedValue(null);
        setIsCopied(false);
        return null;
      }

      if (typeof response.value !== "string" || response.value.length === 0) {
        setRevealedValue(null);
        setErrorMessage("The API key could not be revealed.");
        return null;
      }

      setRevealedValue(response.value);
      return { value: response.value, version: requestVersion };
    } catch (error) {
      if (mountedRef.current && requestVersion === requestVersionRef.current) {
        setRevealedValue(null);
        setIsCopied(false);
        setErrorMessage(getRevealErrorMessage(error));
      }

      return null;
    } finally {
      if (mountedRef.current && requestVersion === requestVersionRef.current) {
        setIsRevealPending(false);
      }
    }
  }

  function handleReveal() {
    if (isInactive || hasExpired(apiKey.expiresAt) || isPending) {
      return;
    }

    if (isRevealed) {
      requestVersionRef.current += 1;
      setRevealedValue(null);
      setIsCopied(false);
      setErrorMessage(null);
      return;
    }

    void requestReveal();
  }

  async function handleCopy() {
    if (isInactive || hasExpired(apiKey.expiresAt) || isPending || !navigator.clipboard) {
      return;
    }

    const revealResult = await requestReveal();
    if (
      revealResult === null
      || !mountedRef.current
      || revealResult.version !== requestVersionRef.current
    ) {
      return;
    }

    if (hasExpired(apiKey.expiresAt)) {
      requestVersionRef.current += 1;
      setIsLocallyExpired(true);
      setRevealedValue(null);
      setIsCopied(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(revealResult.value);

      if (mountedRef.current && revealResult.version === requestVersionRef.current) {
        setIsCopied(true);
      }
    } catch {
      if (mountedRef.current) {
        requestVersionRef.current += 1;
        setRevealedValue(null);
        setIsCopied(false);
        setErrorMessage("The API key could not be copied.");
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
            className="pixelart-icons-font-key shrink-0 text-xl text-secondary-accent max-[599px]:col-start-1! max-[599px]:row-start-1! max-[599px]:text-[18px]! max-[599px]:leading-none! min-[600px]:mt-1 min-[600px]:translate-y-[10px]!"
          />
          <div className="min-w-0 flex-1 max-[599px]:contents!">
            <p className="break-words text-xs! leading-tight! max-[599px]:col-start-2! max-[599px]:row-start-1! max-[599px]:pr-[132px]! min-[900px]:text-base! min-[900px]:leading-tight!">{apiKey.name}</p>
            <p className="mt-1 break-words text-[9px]! leading-tight! text-text-muted! max-[599px]:col-span-full! max-[599px]:row-start-2! max-[599px]:mt-0! max-[599px]:pr-[132px]! min-[900px]:text-[11px]!">
              {apiKey.category ?? "Uncategorized"}
            </p>
            <input
              aria-label={apiKey.name + (isRevealed ? " revealed value" : " masked value")}
              className="mt-2 h-[15px]! w-full min-w-0 border! border-border! bg-surface-elevated! px-1! py-px! text-[8px]! leading-none! text-text-muted! outline-none max-[599px]:col-span-full! max-[599px]:row-start-3! max-[599px]:mt-0! min-[900px]:h-6! min-[900px]:px-1.5! min-[900px]:py-[3px]! min-[900px]:text-[11px]!"
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
          <div className="contents max-[599px]:absolute max-[599px]:right-2 max-[599px]:top-[10px] max-[599px]:flex max-[599px]:max-w-[132px]! max-[599px]:flex-col max-[599px]:items-end">
            <p className={`text-[8px]! leading-tight! max-[599px]:text-right! min-[900px]:text-[10px]! ${statusClass}`}>
              {displayedStatus} · {apiKey.expiresAt === null ? "No expiry" : `Expires ${formatDate(apiKey.expiresAt)}`}
            </p>
            <p className="text-[8px]! leading-tight! text-text-muted! max-[599px]:text-right!">
              Added {formatDate(apiKey.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3 max-[599px]:ml-0 max-[599px]:mt-1 min-[600px]:translate-y-[5px]! min-[900px]:translate-y-[7px]!">
            <button
              aria-label={(isRevealed ? "Hide " : "Reveal ") + apiKey.name}
              className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:[transform:translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 max-[599px]:h-[18px]! max-[599px]:w-[18px]! min-[900px]:h-5! min-[900px]:w-5!"
              disabled={isInactive || isPending}
              onClick={handleReveal}
              type="button"
            >
              <span aria-hidden="true" className="pixelart-icons-font-eye text-[14px]! leading-none! max-[599px]:text-[16px]! min-[900px]:text-[18px]!" />
            </button>
            <button
              aria-label={(isCopied ? "Copied " : "Copy ") + apiKey.name}
              className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:[transform:translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 max-[599px]:h-[18px]! max-[599px]:w-[18px]! min-[900px]:h-5! min-[900px]:w-5!"
              disabled={isInactive || isPending}
              onClick={() => void handleCopy()}
              title={isCopied ? "Copied" : "Copy API key"}
              type="button"
            >
              <span aria-hidden="true" className="pixelart-icons-font-copy text-[14px]! leading-none! max-[599px]:text-[16px]! min-[900px]:text-[18px]!" />
            </button>
            {isOwner && (
              <button
                aria-label={"Manage " + apiKey.name}
                className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center border! border-border! bg-surface-elevated! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:text-primary-accent active:[transform:translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 max-[599px]:h-[18px]! max-[599px]:w-[18px]! min-[900px]:h-5! min-[900px]:w-5!"
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

function getTeamKeyRowKey(apiKey: ApiKey, isBusy: boolean): string {
  return [
    apiKey.id,
    apiKey.name,
    apiKey.category ?? "",
    apiKey.createdAt,
    apiKey.expiresAt ?? "",
    apiKey.revokedAt ?? "",
    apiKey.status,
    isBusy ? "busy" : "idle",
  ].join(":");
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
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const loadRequestRef = useRef(0);
  const toastTimerRef = useRef<number | null>(null);

  const currentMember = members.find((member) => member.userId === authUserId);
  const isOwner = currentMember?.roleName === "Owner";
  const roleLabel = currentMember?.roleName ?? (isLoading ? "Loading..." : "Unknown");

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const requestId = ++loadRequestRef.current;
    let cancelled = false;

    const canApply = () => (
      !cancelled
      && mountedRef.current
      && loadRequestRef.current === requestId
    );

    if (!hasValidTeamId || authUserId === null) {
      return () => {
        cancelled = true;
      };
    }

    Promise.all([getTeam(teamId), getTeamMembers(teamId), getApiKeys(teamId)])
      .then(([loadedTeam, loadedMembers, loadedKeys]) => {
        if (!canApply()) {
          return;
        }

        setTeam(loadedTeam);
        setMembers(loadedMembers);
        setKeys(loadedKeys);
      })
      .catch((error: unknown) => {
        if (!canApply()) {
          return;
        }

        setLoadError(getSafeErrorMessage(error, "The team could not be loaded."));
      })
      .finally(() => {
        if (canApply()) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (loadRequestRef.current === requestId) {
        loadRequestRef.current += 1;
      }
    };
  }, [authUserId, hasValidTeamId, teamId]);

  function isCurrentTeam(): boolean {
    return mountedRef.current;
  }

  function showToast(message: string) {
    if (!mountedRef.current) {
      return;
    }

    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        setToastMessage(null);
      }
      toastTimerRef.current = null;
    }, 2500);
  }

  async function refreshKeyMetadata(): Promise<boolean> {
    if (!hasValidTeamId) {
      return false;
    }

    try {
      const latestKeys = await getApiKeys(teamId);

      if (!isCurrentTeam()) {
        return false;
      }

      setKeys(latestKeys);
      setRefreshError(null);
      return true;
    } catch (error: unknown) {
      if (!isCurrentTeam()) {
        return false;
      }

      setRefreshError(getSafeErrorMessage(error, "The API key list could not be refreshed."));
      return false;
    }
  }

  async function handleRetryRefresh() {
    if (isRefreshing || isMutating) {
      return;
    }

    setIsRefreshing(true);
    await refreshKeyMetadata();
    if (isCurrentTeam()) {
      setIsRefreshing(false);
    }
  }

  async function handleAddKey(request: AddKeyRequest) {
    if (!isOwner || !hasValidTeamId || isMutating) {
      return;
    }

    const name = request.name.trim();
    const value = request.value.trim();
    if (name.length === 0 || value.length === 0) {
      setModalError("Enter a name and API key value.");
      return;
    }

    setIsMutating(true);
    setModalError(null);

    try {
      const createdKey = await createApiKey(teamId, {
        name,
        value,
        category: request.category.trim() || null,
        expiresAt: normaliseExpiry(request.expiresAt),
      });

      if (!isCurrentTeam()) {
        return;
      }

      setKeys((currentKeys) => [...currentKeys, createdKey]);
      setIsAddKeyOpen(false);
      setModalError(null);
      showToast("API key added");
    } catch (error: unknown) {
      if (isCurrentTeam()) {
        setModalError(getSafeErrorMessage(error, "The API key could not be added."));
      }
    } finally {
      if (isCurrentTeam()) {
        setIsMutating(false);
      }
    }
  }

  async function handleSaveKey(update: ManageKeyUpdate) {
    if (!isOwner || !hasValidTeamId || selectedKey === null || isMutating) {
      return;
    }

    const selectedKeyId = selectedKey.id;
    const name = update.name.trim();
    if (name.length === 0) {
      setModalError("Enter a name for the API key.");
      return;
    }

    setIsMutating(true);
    setModalError(null);

    try {
      const updatedKey = await updateApiKey(teamId, selectedKeyId, {
        name,
        value: update.value.trim() || null,
        category: update.category.trim() || null,
        expiresAt: normaliseExpiry(update.expiresAt),
      });

      if (!isCurrentTeam()) {
        return;
      }

      setKeys((currentKeys) => currentKeys.map((key) => (
        key.id === selectedKeyId ? updatedKey : key
      )));
      setSelectedKey(null);
      setModalError(null);
      showToast("API key updated");
    } catch (error: unknown) {
      if (isCurrentTeam()) {
        setModalError(getSafeErrorMessage(error, "The API key could not be updated."));
      }
    } finally {
      if (isCurrentTeam()) {
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

      if (!isCurrentTeam()) {
        return;
      }

      const revokedAt = new Date().toISOString();
      setKeys((currentKeys) => currentKeys.map((key) => (
        key.id === selectedKeyId
          ? { ...key, revokedAt, status: "Revoked" as const }
          : key
      )));
      setSelectedKey(null);
      setModalError(null);

      const refreshed = await refreshKeyMetadata();
      if (isCurrentTeam()) {
        showToast(refreshed ? "API key revoked" : "API key revoked. Refresh the list to update it.");
      }
    } catch (error: unknown) {
      if (isCurrentTeam()) {
        setModalError(getSafeErrorMessage(error, "The API key could not be revoked."));
      }
    } finally {
      if (isCurrentTeam()) {
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
      setModalError(null);
      setIsAddKeyOpen(false);
    }
  }

  function handleOpenSettings() {
    setIsSettingsOpen(true);
  }

  function handleSelectKey(apiKey: ApiKey) {
    if (isMutating) {
      return;
    }

    setModalError(null);
    setSelectedKey(apiKey);
  }

  const renderStatusCard = (message: string, canRetry: boolean) => (
    <div role="alert">
      <Card className="dashboard-card m-0! border-2! border-border! p-5! text-center text-[12px]! text-text-muted! shadow-[3px_3px_0_var(--shadow)]!">
        <p>{message}</p>
        {canRetry && (
          <PrimaryButton
            className="mx-auto! mt-4! inline-flex! h-[24px]! min-h-[24px]! items-center justify-center border-2! border-border! px-2! py-1! text-[10px]! shadow-[2px_2px_0_var(--shadow)]!"
            onClick={onRetry}
          >
            Retry
          </PrimaryButton>
        )}
      </Card>
    </div>
  );

  return (
    <main className="min-h-screen p-4! text-text min-[600px]:px-12! min-[600px]:pb-5! min-[600px]:pt-[22px]!">
      <div className="mx-auto w-full max-w-[900px]">
        <div className="mb-5 flex items-center justify-between gap-3 px-1.5">
          <PrimaryButton
            className="m-0! inline-flex! h-[19px]! min-h-[19px]! items-center justify-center gap-2 whitespace-nowrap px-1.5! py-0.5! text-[10px]! leading-none! min-[900px]:h-[26px]! min-[900px]:min-h-[26px]! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!"
            onClick={onBack}
          >
            <span aria-hidden="true" className="pixelart-icons-font-arrow-left text-[10px]! leading-none! min-[900px]:text-[15px]!" />
            <span className="hidden min-[600px]:inline">Back to dashboard</span>
            <span className="min-[600px]:hidden">Back</span>
          </PrimaryButton>
          <PrimaryButton className="m-0! inline-flex! h-[19px]! min-h-[19px]! items-center justify-center gap-2 whitespace-nowrap px-1.5! py-0.5! text-[10px]! leading-none! min-[900px]:h-[26px]! min-[900px]:min-h-[26px]! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!">
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
            <Card className="dashboard-card m-0! mb-5! flex w-full flex-col gap-3 border-2! border-border! px-4 pb-5! pt-3! shadow-[5px_5px_0_var(--shadow)]! min-[600px]:mb-6! min-[600px]:min-h-[62px] min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between min-[900px]:mb-8! min-[900px]:min-h-[88px] min-[900px]:pb-7! min-[900px]:pt-[18px]!">
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
                <button
                  className="inline-flex! h-5! cursor-pointer items-center justify-center self-end border! border-border! bg-surface-elevated! px-1.5! py-0.5! text-[10px]! leading-none! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:bg-surface active:[transform:translateY(2px)]! min-[600px]:self-auto min-[900px]:h-[26px]! min-[900px]:px-2.5! min-[900px]:py-1! min-[900px]:text-[13px]!"
                  onClick={handleOpenSettings}
                  type="button"
                >
                  Settings
                </button>
              )}
            </Card>

            <div className="mb-3 flex items-center justify-between gap-3 pl-1 pr-1.5 min-[600px]:mb-6 min-[900px]:mb-8!">
              <h2 className="text-base! text-primary-accent! min-[900px]:text-xl! min-[900px]:leading-tight!">Keys</h2>
              {isOwner && (
                <PrimaryButton
                  className="m-0! inline-flex h-[23px]! min-h-[23px]! items-center justify-center gap-1 whitespace-nowrap px-1.5! py-[3px]! text-[10px]! leading-none! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                  onClick={handleOpenAddKey}
                >
                  <span>Add key</span>
                </PrimaryButton>
              )}
            </div>

            {refreshError !== null && (
              <div className="mb-3 flex items-center justify-between gap-3 border-2! border-error! bg-surface-elevated! px-2! py-2! text-[10px]! text-error!" role="alert">
                <span>{refreshError}</span>
                <button
                  className="shrink-0 cursor-pointer border-2! border-border! bg-surface! px-1.5! py-1! text-[10px]! text-text! shadow-[2px_2px_0_var(--shadow)]! disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isRefreshing || isMutating}
                  onClick={() => void handleRetryRefresh()}
                  type="button"
                >
                  {isRefreshing ? "Retrying…" : "Retry"}
                </button>
              </div>
            )}

            {keys.length === 0 ? (
              <Card className="dashboard-card m-0! border-2! border-border! p-5! text-center text-[12px]! text-text-muted! shadow-[3px_3px_0_var(--shadow)]!">
                No API keys have been added yet.
              </Card>
            ) : (
              <div className="flex flex-col gap-3 min-[600px]:gap-5 min-[900px]:gap-6">
                {keys.map((apiKey) => (
                  <TeamKeyRow
                    apiKey={apiKey}
                    isBusy={isMutating}
                    isOwner={isOwner}
                    key={getTeamKeyRowKey(apiKey, isMutating)}
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
              setModalError(null);
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

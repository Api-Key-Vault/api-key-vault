import { useEffect, useRef, useState, type FormEvent } from "react";
import { Card, PrimaryButton } from "@/shared/ui";
import { TeamAccess } from "./TeamAccess";
import type { ManageKeyModalProps } from "../model/types";
import type { TeamMember } from "@/entities/team";
import type { ApiKeyAccess } from "@/entities/api-key-access";

export function ManageKeyModal({
  teamId,
  apiKey,
  apiKeyAccesses,
  teamMembers,
  onClose,
  onRevoke,
  onSave,
  onAddAccess,
  onRevokeAccess,
  isSubmitting = false,
  error,
}: ManageKeyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (dialog !== null && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
      if (opener?.isConnected) {
        opener.focus();
      }
    };
  }, []);
// Api key variables
  const [category, setCategory] = useState(apiKey.category ?? "");
  const initialExpiresAt = apiKey.expiresAt?.slice(0, 10) ?? "";
  const [expiresAt, setExpiresAt] = useState(initialExpiresAt);
  const [isConfirmingRevoke, setIsConfirmingRevoke] = useState(false);
  const [name, setName] = useState(apiKey.name);
  const [value, setValue] = useState("");
  const isRevoked = Boolean(apiKey.revokedAt) || apiKey.status === "Revoked";

  // Api key access variables
  const availableMembers = teamMembers.filter((member: TeamMember) => 
    !apiKeyAccesses.some(access => access.teamMemberId === member.id)
  );

  // Api key functions
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    onSave({
      category: category.trim(),
      expiresAt: expiresAt === initialExpiresAt ? apiKey.expiresAt ?? "" : expiresAt,
      name: name.trim(),
      value: value.trim(),
    });
  }

  function handleRevoke() {
    if (isSubmitting || isRevoked) {
      return;
    }

    onRevoke();
  }

  // Api key access functions
  function handleRevokeAccess(access: ApiKeyAccess) {
    if (isSubmitting || isRevoked) {
      return;
    }
    onRevokeAccess(teamId, access);
  }

  function handleAddAccess(teamMemberId: number) {
    if (isSubmitting || isRevoked) {
      return;
    }
    onAddAccess(teamId, apiKey.id, teamMemberId);
  }

  return (
    <dialog
      aria-labelledby="manage-key-title"
      className="fixed inset-0 z-50 m-0! h-[100dvh] w-screen max-h-none! max-w-none! overflow-visible border-0! bg-transparent! p-4! open:flex open:items-center open:justify-center backdrop:bg-black/40"
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) {
          onClose();
        }
      }}
      onClick={(event) => {
        if (!isSubmitting && event.target === event.currentTarget) {
          onClose();
        }
      }}
      ref={dialogRef}
    >
      <div className="w-full max-w-[32rem]">
        <Card className="dashboard-card relative m-0! flex max-h-[calc(100dvh-2rem)] w-full shrink-0 flex-col gap-3! overflow-y-auto border-2! border-border! px-8! py-5! shadow-[5px_5px_0_var(--shadow)]! max-[599px]:p-4! min-[900px]:px-12!">
          <button
            autoFocus
            aria-label="Close manage key modal"
            className="absolute right-2 top-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center border-0! bg-transparent! text-text! hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true" className="pixelart-icons-font-close text-[18px]! leading-none!" />
          </button>

          <div className="flex shrink-0 items-center justify-center px-7">
            <h2 className="text-xl! leading-tight! text-text! max-[599px]:text-base!" id="manage-key-title">
              Key settings
            </h2>
          </div>

          <form className="flex shrink-0 flex-col gap-2.5!" onSubmit={handleSubmit}>
            {error ? (
              <p
                aria-live="polite"
                className="border-2! border-error! bg-surface-elevated! p-2! text-[11px]! leading-tight! text-error!"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-1!">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="manage-api-key-name">
                Key name
              </label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                disabled={isSubmitting}
                id="manage-api-key-name"
                maxLength={50}
                minLength={3}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </div>

            <div className="flex flex-col gap-1!">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="manage-api-key-value">
                Replace API key
              </label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                disabled={isSubmitting}
                id="manage-api-key-value"
                onChange={(event) => setValue(event.target.value)}
                placeholder="Leave empty to keep the current value"
                type="password"
                value={value}
              />
            </div>

            <div className="flex flex-col gap-1!">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="manage-api-key-category">
                Category
              </label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                disabled={isSubmitting}
                id="manage-api-key-category"
                maxLength={50}
                minLength={3}
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              />
            </div>

            <div className="flex flex-col gap-1!">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="manage-api-key-expires-at">
                Expires on
              </label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                disabled={isSubmitting}
                id="manage-api-key-expires-at"
                onChange={(event) => setExpiresAt(event.target.value)}
                type="date"
                value={expiresAt}
              />
            </div>

            <PrimaryButton
              className="m-0! inline-flex h-[23px]! min-h-[23px]! w-full items-center justify-center gap-1 whitespace-nowrap border-2! border-border! px-1.5! py-[3px]! text-[10px]! leading-none! shadow-[3px_3px_0_var(--shadow)]! disabled:cursor-not-allowed disabled:opacity-50 min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
              disabled={isSubmitting}
            >
              Save changes
            </PrimaryButton>
          </form>
          
          <TeamAccess
            apiKeyAccesses={apiKeyAccesses}
            availableMembers={availableMembers}
            isSubmitting={isSubmitting} 
            onRevokeAccess={handleRevokeAccess}
            onAddAccess={handleAddAccess}
          />

          <section aria-labelledby="manage-key-danger-title" className="flex shrink-0 flex-col gap-2.5 border-t-2! border-dashed! border-text-muted! pt-2.5">
            <h3 className="text-[14px]! leading-tight! text-text! max-[599px]:text-[12px]!" id="manage-key-danger-title">
              Danger zone
            </h3>

            {isConfirmingRevoke ? (
              <div className="flex flex-col gap-2 border-2! border-error! p-2!">
                <p className="text-[11px]! leading-tight! text-text!">
                  Deactivate this key? It cannot be revealed or copied afterwards.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    className="inline-flex h-[23px]! min-h-[23px]! cursor-pointer items-center justify-center whitespace-nowrap border-2! border-border! bg-surface-elevated! px-1.5! py-[3px]! text-[10px]! leading-none! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:bg-surface active:[transform:translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                    onClick={() => setIsConfirmingRevoke(false)}
                    type="button"
                  >
                    Keep key
                  </button>
                  <button
                    className="inline-flex h-[23px]! min-h-[23px]! cursor-pointer items-center justify-center gap-1 whitespace-nowrap border-2! border-border! bg-warning! px-1.5! py-[3px]! text-[10px]! leading-none! text-warning-on-color! shadow-[2px_2px_0_var(--shadow)]! active:[transform:translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting || isRevoked}
                    onClick={handleRevoke}
                    type="button"
                  >
                    Deactivate key
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="inline-flex h-[23px]! min-h-[23px]! cursor-pointer items-center justify-center self-center gap-1 whitespace-nowrap border-2! border-border! bg-warning! px-1.5! py-[3px]! text-[10px]! leading-none! text-warning-on-color! shadow-[2px_2px_0_var(--shadow)]! active:[transform:translateY(2px)]! disabled:cursor-not-allowed disabled:opacity-50 min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                disabled={isSubmitting || isRevoked}
                onClick={() => setIsConfirmingRevoke(true)}
                type="button"
              >
                <span aria-hidden="true" className="pixelart-icons-font-power-off text-[14px]! leading-none!" />
                Deactivate key
              </button>
            )}
          </section>
        </Card>
      </div>
    </dialog>
  );
}

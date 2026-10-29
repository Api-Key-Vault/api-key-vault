import { useEffect, useRef, useState } from "react";
import { Card, DeleteButton, PrimaryButton, ErrorMessage } from "@/shared/ui";
import type { Team, TeamMember } from "@/entities/team";
import { createInvite } from "@/features/create-invite";

type TeamSettingsModalProps = {
  isOwner?: boolean;
  onClose: () => void;
  onLeave?: () => void;
  onRemoveMember?: (teamMemberId: number) => void;
  team: Pick<Team, "id" | "name"> & { members: TeamMember[] };
};

export function TeamSettingsModal({
  isOwner = false,
  onClose,
  onLeave,
  onRemoveMember,
  team,
}: TeamSettingsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [inviteUrl, setInviteUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

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

  async function handleGenerateInviteLink() {
    try {
      setInviteError("");
     
      const inviteLink = await createInvite(team.id);

      setInviteUrl(inviteLink.inviteUrl);
      setIsCopied(false);
    } catch {
      setInviteError("Could not generate invite link. Please try again.");
    }
  }

  async function handleCopyInviteLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setIsCopied(true);
    } catch {
      setInviteError("Failed to copy invite link.");
    }
  }

  function handleDeleteTeam() {
    // Team deletion is not wired yet.
  }

  return (
    <dialog
      aria-labelledby="team-settings-title"
      className="fixed inset-0 z-50 m-0! h-dvh w-screen max-h-none! max-w-none! overflow-visible border-0! bg-transparent! p-4! open:flex open:items-center open:justify-center backdrop:bg-black/40"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      ref={dialogRef}
    >
      <div className="w-full max-w-md">
        <Card className="relative m-0! flex max-h-[calc(100dvh-2rem)] w-full shrink-0 flex-col gap-3! overflow-y-autopx-8! py-5! max-[599px]:p-4! min-[900px]:px-12!">
          <button
            autoFocus
            aria-label="Close team settings modal"
            className="absolute right-2 top-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center border-0! bg-transparent! text-text! hover:text-primary-accent"
            onClick={onClose}
            type="button"
          >
            <span
              aria-hidden="true"
              className="pixelart-icons-font-close text-[18px]! leading-none!"
            />
          </button>

          <div className="flex shrink-0 items-center justify-center px-7">
            <h2
              className="text-xl! leading-tight! text-text! max-[599px]:text-base!"
              id="team-settings-title"
            >
              Team settings
            </h2>
          </div>

          <form
            className="flex shrink-0 flex-col gap-5"
            onSubmit={(event) => event.preventDefault()}
          >
            {isOwner && (
              <div className="flex shrink-0 flex-col gap-1!">
                <label
                  className="text-[14px]! text-text! max-[599px]:text-[12px]!"
                  htmlFor="team-settings-name"
                >
                  Team name
                </label>
                <input
                  className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-1.25! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                  disabled
                  id="team-settings-name"
                  required
                  value={team.name}
                />
              </div>
            )}

            {isOwner && (
              <PrimaryButton
                className="m-auto! inline-flex w-[75%] items-center text-sm! justify-center whitespace-nowrap leading-none! disabled:cursor-not-allowed disabled:opacity-50"
                disabled
              >
                Save changes
              </PrimaryButton>
            )}

            <section
              aria-label="Team members"
              className="flex shrink-0 flex-col gap-3 border-t-2! border-dashed! border-text-muted! pt-2.5"
            >
              {team.members.map((member) => (
                <div
                  className="flex items-center gap-1.5 border-2! border-border! bg-surface-elevated! px-2! py-1!"
                  key={member.id}
                >
                  <span className="text-[11px]! leading-tight! text-text!">{member.displayName || member.userId}</span>
                  <span className="ml-auto! whitespace-nowrap text-[10px]! leading-tight! text-text-muted!">{member.roleName}</span>
                  {isOwner && member.roleName === "Member" && (
                  <button
                    aria-label={`Remove ${member.displayName || member.userId}`}
                    className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center border-0! bg-transparent! p-0! text-error!"
                    onClick={() => onRemoveMember?.(member.id)}
                    type="button"
                  >
                    <span aria-hidden="true" className="pixelart-icons-font-trash text-[14px]! leading-none!" />
                  </button>
                )}
                </div>
              ))}

              {/* TODO: Show "Leave Team" for Owner with a warning popup explaining that
                  the team and all its members are deleted when the Owner leaves.
                  Requires backend support first. */}
              {!isOwner && (
                <PrimaryButton
                  className="m-auto! inline-flex! w-[75%] cursor-pointer items-center justify-center whitespace-nowrap bg-error! text-sm! leading-none! text-error-on-color!"
                  onClick={onLeave}
                >
                  Leave team
                </PrimaryButton>
              )}

              {isOwner && (
                <PrimaryButton
                  aria-label="Generate invite link"
                  className="m-auto! mt-2! inline-flex! w-[75%] text-sm cursor-pointer items-center justify-center gap-2 whitespace-nowrap leading-none! text-text-on-accent!"
                  onClick={handleGenerateInviteLink}
                >
                  <span
                    aria-hidden="true"
                    className="pixelart-icons-font-link text-[14px]! leading-none!"
                  />
                  Generate invite link
                </PrimaryButton>
              )}

              {isOwner && inviteError && <ErrorMessage message={inviteError} onClose={() => setInviteError("")} />}

              {isOwner && inviteUrl && (
                <div className="flex flex-col gap-2">
                  <span className="text-[12px]! text-text!">Invite link</span>

                  <div className="flex items-center gap-2 border-2! border-border! bg-surface-elevated! px-2! py-2!">
                    <p className="min-w-0 flex-1 break-all text-[10px]! leading-relaxed! text-text!">
                      {inviteUrl}
                    </p>

                    <button
                      type="button"
                      aria-label="Copy invite link"
                      onClick={handleCopyInviteLink}
                      className="flex shrink-0 cursor-pointer items-center justify-center border-2! border-border! 
                  bg-primary-accent! px-2! py-2! text-text-on-accent! shadow-[3px_3px_0_var(--color-shadow)] hover:bg-primary-accent-hover!"
                    >
                      <span
                        aria-hidden="true"
                        className="pixelart-icons-font-copy text-[16px]! leading-none!"
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px]! text-text-muted!">
                      Link expires in 15 minutes
                    </span>

                    {isCopied && (
                      <span
                        role="status"
                        className="text-[10px]! text-success!"
                      >
                        Copied!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </section>

            {isOwner && (
              <section
                aria-labelledby="team-settings-danger-title"
                className="flex shrink-0 flex-col gap-2.5 border-t-2! border-dashed! border-text-muted! pt-2.5"
              >
                <h3
                  className="text-[14px]! leading-tight! text-text! max-[599px]:text-[12px]!"
                  id="team-settings-danger-title"
                >
                  Danger zone
                </h3>
                <DeleteButton
                  aria-label="Delete team"
                  className="self-center inline-flex! text-sm! cursor-pointer items-center justify-center whitespace-nowrap leading-none! text-error-on-color!"
                  onClick={handleDeleteTeam}
                >
                  Delete team
                </DeleteButton>
              </section>
            )}
          </form>
        </Card>
      </div>
    </dialog>
  );
}

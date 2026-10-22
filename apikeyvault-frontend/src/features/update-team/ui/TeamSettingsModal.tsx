import { useEffect, useRef } from "react";
import { Card, PrimaryButton } from "@/shared/ui";
import type { Team, TeamMember } from "@/entities/team";

type TeamSettingsModalProps = {
  isOwner?: boolean;
  onClose: () => void;
  onLeave?: () => void;
  onRemoveMember?: (teamMemberId: number) => void;
  team: Pick<Team, "name"> & { members: TeamMember[] };
};

export function TeamSettingsModal({ isOwner = false, onClose, onLeave, onRemoveMember, team }: TeamSettingsModalProps) {
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

  function handleGenerateInviteLink() {
    // Invite link generation is not wired yet.
  }

  function handleDeleteTeam() {
    // Team deletion is not wired yet.
  }

  return (
    <dialog
      aria-labelledby="team-settings-title"
      className="fixed inset-0 z-50 m-0! h-[100dvh] w-screen max-h-none! max-w-none! overflow-visible border-0! bg-transparent! p-4! open:flex open:items-center open:justify-center backdrop:bg-black/40"
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
      <div className="w-full max-w-[32rem]">
        <Card className="dashboard-card relative m-0! flex max-h-[calc(100dvh-2rem)] w-full shrink-0 flex-col gap-3! overflow-y-auto border-2! border-border! px-8! py-5! shadow-[5px_5px_0_var(--shadow)]! max-[599px]:p-4! min-[900px]:px-12!">
          <button
            autoFocus
            aria-label="Close team settings modal"
            className="absolute right-2 top-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center border-0! bg-transparent! text-text! hover:text-primary-accent"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true" className="pixelart-icons-font-close text-[18px]! leading-none!" />
          </button>

          <div className="flex shrink-0 items-center justify-center px-7">
            <h2 className="text-xl! leading-tight! text-text! max-[599px]:text-base!" id="team-settings-title">
              Team settings
            </h2>
          </div>

          <form className="flex shrink-0 flex-col gap-2.5!" onSubmit={(event) => event.preventDefault()}>
            {isOwner && (
              <div className="flex shrink-0 flex-col gap-1!">
                <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="team-settings-name">
                  Team name
                </label>
                <input
                  className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                  disabled
                  id="team-settings-name"
                  required
                  value={team.name}
                />
                <p className="text-[11px]! leading-tight! text-text-muted!">
                  Team renaming is not available yet.
                </p>
              </div>
            )}

            {isOwner && (
              <PrimaryButton
                className="m-0! inline-flex h-[23px]! min-h-[23px]! w-full items-center justify-center gap-1 whitespace-nowrap border-2! border-border! px-1.5! py-[3px]! text-[10px]! leading-none! shadow-[3px_3px_0_var(--shadow)]! disabled:cursor-not-allowed disabled:opacity-50 min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                disabled
              >
                Save changes
              </PrimaryButton>
            )}

            <section aria-label="Team members" className="flex shrink-0 flex-col gap-1.5 border-t-2! border-dashed! border-text-muted! pt-2.5">
              {team.members.map((member) => (
                <div className="flex items-center gap-1.5 border-2! border-border! bg-surface-elevated! px-2! py-1!"
                key={member.id}
                >
                  <span className="text-[11px]! leading-tight! text-text!">{member.userId}</span>
                  <span className="ml-auto! whitespace-nowrap text-[10px]! leading-tight! text-text-muted!">{member.roleName}</span>
                  {isOwner && member.roleName === "Member" && (
                  <button
                    aria-label={`Remove ${member.userId}`}
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
                <button
                  className="inline-flex h-[23px]! min-h-[23px]! w-full cursor-pointer items-center justify-center whitespace-nowrap border-2! border-border! bg-error! px-1.5! py-[3px]! text-[10px]! leading-none! text-error-on-color! shadow-[3px_3px_0_var(--shadow)]! active:[transform:translateY(2px)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                  onClick={onLeave}
                  type="button"
                >
                  Leave team
                </button>
              )}

              {isOwner && (
                <button
                  aria-label="Generate invite link"
                  className="inline-flex h-[23px]! min-h-[23px]! w-full cursor-pointer items-center justify-center gap-1 whitespace-nowrap border-2! border-border! bg-primary-accent! px-1.5! py-[3px]! text-[10px]! leading-none! text-text-on-accent! shadow-[3px_3px_0_var(--shadow)]! hover:bg-primary-accent-hover! active:[transform:translateY(2px)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                  onClick={handleGenerateInviteLink}
                  type="button"
                >
                  <span aria-hidden="true" className="pixelart-icons-font-link text-[14px]! leading-none!" />
                  Generate invite link
                </button>
              )}
            </section>

              {isOwner && (
              <section aria-labelledby="team-settings-danger-title" className="flex shrink-0 flex-col gap-2.5 border-t-2! border-dashed! border-text-muted! pt-2.5">
                <h3 className="text-[14px]! leading-tight! text-text! max-[599px]:text-[12px]!" id="team-settings-danger-title">
                  Danger zone
                </h3>
                <button
                  aria-label="Delete team"
                  className="self-center inline-flex h-[23px]! min-h-[23px]! cursor-pointer items-center justify-center gap-1 whitespace-nowrap border-2! border-border! bg-error! px-1.5! py-[3px]! text-[10px]! leading-none! text-error-on-color! shadow-[2px_2px_0_var(--shadow)]! active:[transform:translateY(2px)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                  onClick={handleDeleteTeam}
                  type="button"
                >
                  <span aria-hidden="true" className="pixelart-icons-font-trash text-[14px]! leading-none!" />
                  Delete team
                </button>
              </section>
              )}
          </form>
        </Card>
      </div>
    </dialog>
  );
}

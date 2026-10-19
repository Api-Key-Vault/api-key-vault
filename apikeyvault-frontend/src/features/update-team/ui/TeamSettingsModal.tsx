import { Card, PrimaryButton } from "@/shared/ui";
import type { Team, TeamMember } from "@/entities/team";

type TeamSettingsModalProps = {
  onClose: () => void;
  team: Pick<Team, "name"> & { members: TeamMember[] };
};

export function TeamSettingsModal({ onClose, team }: TeamSettingsModalProps) {
  function handleRemoveMember() {
    // Member removal is not wired yet.
  }

  function handleGenerateInviteLink() {
    // Invite link generation is not wired yet.
  }

  function handleDeleteTeam() {
    // Team deletion is not wired yet.
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        aria-labelledby="team-settings-title"
        aria-modal="true"
        className="w-full max-w-[32rem]"
        role="dialog"
      >
        <Card className="dashboard-card relative m-0! flex max-h-[calc(100dvh-2rem)] w-full shrink-0 flex-col gap-3! overflow-y-auto border-2! border-border! px-8! py-5! shadow-[5px_5px_0_var(--shadow)]! max-[599px]:p-4! min-[900px]:px-12!">
          <button
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

            <PrimaryButton
              className="m-0! inline-flex h-[23px]! min-h-[23px]! w-full items-center justify-center gap-1 whitespace-nowrap border-2! border-border! px-1.5! py-[3px]! text-[10px]! leading-none! shadow-[3px_3px_0_var(--shadow)]! disabled:cursor-not-allowed disabled:opacity-50 min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
              disabled
            >
              Save changes
            </PrimaryButton>

            <section aria-label="Team members" className="flex shrink-0 flex-col gap-1.5 border-t-2! border-dashed! border-text-muted! pt-2.5">
              <div className="flex items-center gap-1.5 border-2! border-border! bg-surface-elevated! px-2! py-1!">
                <span className="text-[11px]! leading-tight! text-text!">Theo</span>
                <span className="ml-auto! whitespace-nowrap text-[10px]! leading-tight! text-text-muted!">Member</span>
                <button
                  aria-label="Remove Theo"
                  className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center border-0! bg-transparent! p-0! text-error!"
                  onClick={handleRemoveMember}
                  type="button"
                >
                  <span aria-hidden="true" className="pixelart-icons-font-trash text-[14px]! leading-none!" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 border-2! border-border! bg-surface-elevated! px-2! py-1!">
                <span className="text-[11px]! leading-tight! text-text!">Victoria</span>
                <span className="ml-auto! whitespace-nowrap text-[10px]! leading-tight! text-text-muted!">Member</span>
                <button
                  aria-label="Remove Victoria"
                  className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center border-0! bg-transparent! p-0! text-error!"
                  onClick={handleRemoveMember}
                  type="button"
                >
                  <span aria-hidden="true" className="pixelart-icons-font-trash text-[14px]! leading-none!" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 border-2! border-border! bg-surface-elevated! px-2! py-1!">
                <span className="text-[11px]! leading-tight! text-text!">Aldor</span>
                <span className="ml-auto! whitespace-nowrap text-[10px]! leading-tight! text-text-muted!">Invite pending</span>
                <button
                  aria-label="Remove Aldor"
                  className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center border-0! bg-transparent! p-0! text-error!"
                  onClick={handleRemoveMember}
                  type="button"
                >
                  <span aria-hidden="true" className="pixelart-icons-font-trash text-[14px]! leading-none!" />
                </button>
              </div>

              <button
                aria-label="Generate invite link"
                className="inline-flex h-[23px]! min-h-[23px]! w-full cursor-pointer items-center justify-center gap-1 whitespace-nowrap border-2! border-border! bg-primary-accent! px-1.5! py-[3px]! text-[10px]! leading-none! text-text-on-accent! shadow-[3px_3px_0_var(--shadow)]! hover:bg-primary-accent-hover! active:[transform:translateY(2px)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                onClick={handleGenerateInviteLink}
                type="button"
              >
                <span aria-hidden="true" className="pixelart-icons-font-link text-[14px]! leading-none!" />
                Generate invite link
              </button>
            </section>

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
          </form>
        </Card>
      </div>
    </div>
  );
}

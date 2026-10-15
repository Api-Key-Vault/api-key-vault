import { useState, type FormEvent } from "react";
import { Card, PrimaryButton } from "@/shared/ui";
import type { Team } from "@/entities/team";

type TeamSettingsModalProps = {
  onClose: () => void;
  onSaveName: (name: string) => void;
  team: Pick<Team, "name" | "members">;
};

export default function TeamSettingsModal({
  onClose,
  onSaveName,
  team,
}: TeamSettingsModalProps) {
  const [name, setName] = useState(team.name);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSaveName(name.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        aria-labelledby="team-settings-title"
        aria-modal="true"
        className="w-full max-w-[32rem]"
        role="dialog"
      >
        <Card className="dashboard-card relative m-0! flex w-full flex-col gap-5 border-2! border-border! p-5! shadow-[5px_5px_0_var(--shadow)]! max-[599px]:gap-4! max-[599px]:p-4!">
          <button
            aria-label="Close team settings modal"
            className="absolute right-2 top-2 inline-flex h-6 w-6 cursor-pointer items-center justify-center border-0! bg-transparent! text-text! hover:text-primary-accent"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true" className="pixelart-icons-font-close text-[18px]! leading-none!" />
          </button>

          <div className="flex items-center gap-2.5 pr-7">
            <span
              aria-hidden="true"
              className="pixelart-icons-font-settings-2 text-2xl! leading-none! text-secondary-accent!"
            />
            <h2 className="text-xl! leading-tight! text-text! max-[599px]:text-base!" id="team-settings-title">
              Team settings
            </h2>
          </div>

          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.25">
              <label className="text-[14px]! text-text! max-[599px]:text-[12px]!" htmlFor="team-settings-name">
                Team name
              </label>
              <input
                className="min-h-8! w-full border-2! border-border! bg-surface-elevated! px-2! py-[5px]! text-[14px]! text-text! placeholder:text-text-muted focus:outline-2 focus:outline-primary-accent focus:outline-offset-2 max-[599px]:text-[12px]!"
                id="team-settings-name"
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 border-2! border-border! p-3! text-text!">
              <span className="text-[11px]! text-text-muted!">Your role</span>
              <span className="text-right text-[11px]!">Owner</span>
              <span className="text-[11px]! text-text-muted!">Members</span>
              <span className="text-right text-[11px]!">{team.members.length}</span>
            </div>

            <div className="mt-1.5 flex justify-end gap-3 max-[599px]:gap-2.5">
              <button
                className="inline-flex h-[23px]! min-h-[23px]! cursor-pointer items-center justify-center whitespace-nowrap border-2! border-border! bg-surface-elevated! px-1.5! py-[3px]! text-[10px]! leading-none! text-text! shadow-[2px_2px_0_var(--shadow)]! hover:bg-surface active:[transform:translateY(2px)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <PrimaryButton className="m-0! inline-flex h-[23px]! min-h-[23px]! items-center justify-center gap-1 whitespace-nowrap border-2! border-border! px-1.5! py-[3px]! text-[10px]! leading-none! shadow-[0_4px_4px_rgba(0,0,0,0.25)]! min-[900px]:h-[29px]! min-[900px]:min-h-[29px]! min-[900px]:px-2.5! min-[900px]:py-[5px]! min-[900px]:text-[13px]!">
                Save changes
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

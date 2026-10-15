import Card from "@/shared/ui/Card";
import PrimaryButton from "@/shared/ui/PrimaryButton";

type CreateTeamModalProps = {
    onClose?: () => void;
};

export default function CreateTeamModal({onClose}: CreateTeamModalProps){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <Card className="relative p-4 w-80 flex flex-col gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-2 right-2 text-text cursor-pointer"
                >
                    <span className="pixelart-icons-font-close text-[24px]!" />
                </button>
                <h2 className="text-text text-xl text-center">Create team</h2>
                <div className="flex flex-col gap-2 text-left">
                    <label htmlFor="team-name" className="text-text">Team name</label>
                    <input id="team-name" type="text"
                        className="w-full border-2! border-border! bg-surface-elevated text-text px-2 py-1" />
                </div>
                {/* TODO: Add function to create the team name from the input field and send it to the API to create the team. Close the modal when the team is created. */}
                <PrimaryButton className="w-[90%]">Create</PrimaryButton>
            </Card>
        </div>
    );
}

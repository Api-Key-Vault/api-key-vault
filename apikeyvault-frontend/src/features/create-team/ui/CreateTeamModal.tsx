import { Card, PrimaryButton } from "@/shared/ui";
import { useState } from "react";
import { createTeam } from "../api/createTeam";
import type { TeamResponse } from "@/features/get-team";

type CreateTeamModalProps = {
	onClose: () => void;
	onTeamCreated: (newTeam: TeamResponse) => void;
};

export function CreateTeamModal({
	onClose,
	onTeamCreated,
}: CreateTeamModalProps) {
	const [teamName, setTeamName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => {
		if (!teamName.trim()) return;
		setIsLoading(true);
		try {
			const newTeam = await createTeam({ name: teamName });
			onTeamCreated(newTeam);
			onClose();
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
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
					<label htmlFor="team-name" className="text-text">
						Team name
					</label>
					<input
						value={teamName}
						onChange={(e) => setTeamName(e.target.value)}
						id="team-name"
						type="text"
						className="w-full border-2! border-border! bg-surface-elevated text-text px-2 py-1"
					/>
				</div>
				<PrimaryButton onClick={handleSubmit} className="w-[90%]">
					{isLoading ? "Creating..." : "Create"}
				</PrimaryButton>
			</Card>
		</div>
	);
}

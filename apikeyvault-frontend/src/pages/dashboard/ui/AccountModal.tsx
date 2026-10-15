import { Card, DeleteButton } from "@/shared/ui";

type AccountModalProps ={
    onClose?: () => void;
};

export default function AccountModal({ onClose }: AccountModalProps) {
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

				<div className="flex flex-row items-center justify-center gap-4">
					<span className="pixelart-icons-font-github text-text text-[30px]!" />
					<h2 className="text-text text-xl">Your account</h2>
				</div>

				<div className="flex flex-row items-center justify-start gap-5 mt-4">
                    {/* TODO: Show the user's real GitHub profile picture here instead of this icon. 
                    The picture URL comes from the logged-in user's GitHub data (via the API). */}
					<span className="pixelart-icons-font-user text-text text-[50px]!" />
					{/* TODO: Replace hardcoded username with the logged-in user's GitHub username. */}
					<p className="text-text">Vic-Linden</p>
				</div>

				<hr className="border-t-2! border-dashed! border-text-muted!" />

				<p className="text-text text-left">Danger zone</p>
				{/* TODO: Add function to delete the account. */}
				<DeleteButton className="w-[90%]">Delete account</DeleteButton>
			</Card>
		</div>
	);
}

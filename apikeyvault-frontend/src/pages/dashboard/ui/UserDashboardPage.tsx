import { useEffect, useState } from "react";
import { Card, PrimaryButton } from "@/shared/ui";
import { TeamCard } from "./TeamCard";
import { StatsBox } from "./StatsBox";
import { AvatarButton } from "@/shared/ui/AvatarButton";
import { CreateTeamModal } from "@/features/create-team";
import { AccountModal } from "./AccountModal";
import type { TeamResponse } from "@/features/get-team";
import { getAllTeams } from "@/features/get-team/api/getTeam";

export function UserDashboardPage() {
	const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
	const [isAccountOpen, setIsAccountOpen] = useState(false);
	const [userTeams, setUserTeams] = useState<TeamResponse[]>([]);

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const teams = await getAllTeams();
				setUserTeams(teams);
			} catch (error) {
				console.error("Failed to fetch teams:", error);
			}
		};
		fetchTeams();
	}, []);

	const totalKeys = userTeams.reduce((sum, team) => sum + team.keys, 0);
	const totalMembers = userTeams.reduce((sum, team) => sum + team.members, 0);

	return (
		<section className="flex flex-col items-center w-full min-h-screen p-8 gap-8">
			{/* HEADERN */}
			<Card className="p-4 w-[83rem] flex flex-row items-center justify-between">
				<div className="flex flex-row items-center gap-8">
					<span className="pixelart-icons-font-key text-secondary-accent text-[50px]!" />
					<div className="text-left flex flex-col gap-1">
						<h1 className="text-text text-2xl">API Key Vault</h1>
						<p className="text-text-muted text-2xl">Your teams</p>
					</div>
				</div>

				<div className="flex flex-row items-center gap-6">
					<AvatarButton onClick={() => setIsAccountOpen(true)} />
					{/*TODO: Add logout function.*/}
					<PrimaryButton className="text-xl px-4! py-1!">Logout</PrimaryButton>
				</div>
			</Card>

			{/* STATS BOXES */}
			<div className="flex mt-8 flex-row gap-50 w-4/5 justify-center">
				{/*TODO: Replace hardcoded number with real team count.*/}
				<StatsBox
					icon={
						<span className="pixelart-icons-font-users text-text text-[35px]!" />
					}
					count={userTeams.length}
					label="Teams"
				/>

				{/*TODO: Replace hardcoded number with real API key count.*/}
				<StatsBox
					icon={
						<span className="pixelart-icons-font-key text-secondary-accent text-[35px]!" />
					}
					count={totalKeys}
					label="API Keys"
				/>

				{/*TODO: Replace hardcoded number with real member count.*/}
				<StatsBox
					icon={
						<span className="pixelart-icons-font-user-plus text-text text-[35px]!" />
					}
					count={totalMembers}
					label="Members"
				/>
			</div>

			<div className="flex flex-col gap-8 w-fit">
				<div className="flex flex-row items-center justify-between w-full">
					<h2 className="text-primary-accent text-2xl">Teams</h2>
					<PrimaryButton
						className="text-xl px-4! py-1!"
						onClick={() => setIsCreateTeamOpen(true)}
					>
						Create team
					</PrimaryButton>
				</div>

				<div className="flex flex-row gap-50 justify-center">
					{userTeams.map((team) => (
						<TeamCard
							key={team.id}
							name={team.name}
							keyCount={team.keys}
							memberCount={team.members}
						/>
					))}
				</div>
			</div>
			{isCreateTeamOpen && (
				<CreateTeamModal onClose={() => setIsCreateTeamOpen(false)} />
			)}

			{isAccountOpen && (
				<AccountModal onClose={() => setIsAccountOpen(false)} />
			)}
		</section>
	);
}

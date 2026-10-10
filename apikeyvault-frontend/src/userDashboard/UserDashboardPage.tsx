import { useState } from "react";
import Card from "../components/atoms/Card";
import PrimaryButton from "../components/atoms/PrimaryButton";
import TeamCard from "./components/TeamCard";
import StatsBox from "./components/StatsBox";
import AvatarButton from "./components/AvatarButton";
import CreateTeamModal from "./components/CreateTeamModal";
import AccountModal from "./components/AccountModal";

export default function UserDashboardPage(){

    const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

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
                icon={<span className="pixelart-icons-font-users text-text text-[35px]!" />}
                count={3}
	            label="Teams"
               />

	            {/*TODO: Replace hardcoded number with real API key count.*/}
                <StatsBox 
                icon={<span className="pixelart-icons-font-key text-secondary-accent text-[35px]!" />}
                count={16}
                label="API Keys"
                />

	            {/*TODO: Replace hardcoded number with real member count.*/}
                <StatsBox 
                icon={<span className="pixelart-icons-font-user-plus text-text text-[35px]!" />}
                count={15}
                label="Members"
                />
            </div>

            <div className="flex flex-col gap-8 w-fit">
                <div className="flex flex-row items-center justify-between w-full">
                    <h2 className="text-primary-accent text-2xl">Teams</h2>
                    {/* TODO: Add function to create team button. */}
                    <PrimaryButton 
                        className="text-xl px-4! py-1!"
                        onClick={() => setIsCreateTeamOpen(true)}>Create team</PrimaryButton>
                </div>
                
                <div className="flex flex-row gap-50 justify-center">
                    {/* TODO: Replace hardcoded team data with real teams (name, key count, member count) from the API. */}
                    <TeamCard name="Team 1" keyCount={12} memberCount={3}></TeamCard>
                    <TeamCard name="Team 2" keyCount={4} memberCount={5} />
                    <TeamCard name="Team 3" keyCount={6} memberCount={7} />
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
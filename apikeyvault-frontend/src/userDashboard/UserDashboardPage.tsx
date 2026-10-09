import Card from "../components/atoms/Card";
import PrimaryButton from "../components/atoms/PrimaryButton";
import TeamCard from "./components/TeamCard";
import StatsBox from "./components/StatsBox";

export default function UserDashboardPage(){
    return (
        <section className="flex flex-col items-center w-full min-h-screen p-8 gap-8">

            {/* HEADERN */}
            <Card className="p-4 w-4/5 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-8">
                    <span className="pixelart-icons-font-key text-secondary-accent text-[50px]!" />
                    <div className="text-left flex flex-col gap-1">
                        <h1 className="text-text text-2xl">API Key Vault</h1>
                        <p className="text-text-muted text-2xl">Your teams</p>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-6">
                    <span className="pixelart-icons-font-user text-text text-[40px]!" />
                    {/*TODO: Add logout function.*/}
                    <PrimaryButton>Logout</PrimaryButton>
                </div>
            </Card>

            {/* STATS BOXES */}
            <div className="flex mt-8 flex-row gap-4 w-4/5 justify-between">
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

            <div className="flex mt-7 flex-row items-center justify-between w-4/5">
                <h2 className="text-primary-accent text-2xl">Teams</h2>
                {/* TODO: Add function to create team button. */}
                <PrimaryButton>Create team</PrimaryButton>
            </div>

            <div className="flex flex-row gap-4 w-4/5 justify-between">
                {/* TODO: Replace hardcoded team data with real teams (name, key count, member count) from the API. */}
                <TeamCard name="Team 1" keyCount={12} memberCount={3}></TeamCard>
            </div>
        </section>
    );
}
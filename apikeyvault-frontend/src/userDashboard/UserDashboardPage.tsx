import Card from "../components/atoms/Card";
import PrimaryButton from "../components/atoms/PrimaryButton";

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

            {/* SUMMARY BOXES */}
            <div className="flex mt-8 flex-row gap-4 w-4/5 justify-between">
                <Card className="p-4 w-75 flex flex-row items-center gap-5">
                    <span className="pixelart-icons-font-users text-text text-[35px]!" />
                    {/* TODO: Replace hardcoded number with real team count. */}
                    <p className="text-text">3 teams</p>
                </Card>

                <Card className="p-4 w-75 flex flex-row items-center gap-5">
	                <span className="pixelart-icons-font-key text-secondary-accent text-[35px]!" />
	                {/* TODO: Replace hardcoded number with real API key count. */}
	                <p className="text-text">16 API keys</p>
                </Card>

                <Card className="p-4 w-75 flex flex-row items-center gap-5">
	                <span className="pixelart-icons-font-user-plus text-text text-[35px]!" />
	                {/* TODO: Replace hardcoded number with real member count. */}
	                <p className="text-text">15 Members</p>
                </Card>
            </div>
        </section>
    );
}
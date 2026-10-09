import Card from '../../components/atoms/Card';

type TeamCardProps ={
    name: string;
    keyCount: number;
    memberCount: number;
};

export default function TeamCard({
    name,
    keyCount,
    memberCount,
}: TeamCardProps){
    return(
        <Card className="p-4 w-75 h-48 flex flex-col items-center gap-4">
            {/* TODO: Make the card clickable and navigate to the team page. */}
            <h3 className="text-text text-xl ">{name}</h3>
            <div className="flex flex-row items-center gap-4 w-4/5 border-2! border-border! bg-surface-elevated px-2 py-1">
                <span className="pixelart-icons-font-key text-secondary-accent text-[20px]!" />
                <p className="text-text">{keyCount} Keys</p>
            </div>
            <div className="flex flex-row items-center gap-4 w-4/5 border-2! border-border! bg-surface-elevated px-2 py-1">
                <span className="pixelart-icons-font-users text-text text-[20px]!" />
                <p className="text-text">{memberCount} Members</p>
            </div>
        </Card>
    );
}
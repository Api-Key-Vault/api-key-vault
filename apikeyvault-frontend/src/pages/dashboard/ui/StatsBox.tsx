import type { ReactNode } from "react";
import Card from "@/shared/ui/Card";

type StatsBoxProps = {
    icon: ReactNode;
    count: number;
    label: string;
};

export default function StatsBox({
    icon,
    count,
    label
}: StatsBoxProps){
    return(
        <Card className="p-4 w-75 flex flex-row items-center gap-5">
            {icon}
            <p className="text-text text-xl">
                <span className="font-bold">{count}</span>{" "}
                <span className="text-text-muted">{label}</span>
            </p>
        </Card>
    );
}

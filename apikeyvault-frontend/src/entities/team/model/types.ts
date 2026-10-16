export type TeamRole = "Owner" | "Member";

export type TeamMember = {
  id: number;
  name: string;
  role: TeamRole;
};

export type Team = {
  name: string;
  members: TeamMember[];
};

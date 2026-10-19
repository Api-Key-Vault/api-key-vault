export type TeamRole = "Owner" | "Member";

export type TeamMember = {
  id: number;
  userId: string;
  teamId: number;
  roleName: TeamRole;
};

export type Team = {
  id: number;
  name: string;
  createdAt: string;
};

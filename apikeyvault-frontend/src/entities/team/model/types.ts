export type TeamRole = "Owner" | "Member";

export type TeamMember = {
  id: number;
  userId: string;
  teamId: number;
  roleName: TeamRole;
  displayName: string;
};

export type Team = {
  id: number;
  name: string;
  createdAt: string;
};

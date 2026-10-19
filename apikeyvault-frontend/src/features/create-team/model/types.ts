export type CreateTeamRequest = {
	name: string;
};

export type TeamResponse = {
	id: number;
	name: string;
	members: number;
	keys: number;
};
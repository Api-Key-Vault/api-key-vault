export type CreateTeamRequest = {
    name: string
}

export type GetTeamResponse = {
    id: number,
    name: string,
    createdAt: Date
}
import type { TeamResponse } from "@/features/get-team";
import type { CreateTeamRequest } from "../model/types";
import { apiClient } from "@/shared/api";


export async function createTeam(data: CreateTeamRequest): Promise<TeamResponse> {
    const response = await apiClient.post("teams", data)
    return response.data as TeamResponse
}
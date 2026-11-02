import { apiClient } from "@/shared/api";
import type { UpdateTeamRequest, UpdateTeamResponse } from "../model/types";

export async function updateTeam(
    teamId: number,
    data: UpdateTeamRequest
): Promise<UpdateTeamResponse> {
    const response = await apiClient.put<UpdateTeamResponse>(
        `teams/${teamId}`,
        data
    );
    return response.data;
}
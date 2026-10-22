import type { TeamResponse } from "@/features/create-team";
import { apiClient } from "@/shared/api";

export async function getAllTeams(): Promise<TeamResponse[]> {
    const response = await apiClient.get<TeamResponse[]>("teams")
    return response.data
}
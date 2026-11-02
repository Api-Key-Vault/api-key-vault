import { apiClient } from "@/shared/api";

export async function deleteTeam(teamId: number): Promise<void> {
    await apiClient.delete(`teams/${teamId}`);
}
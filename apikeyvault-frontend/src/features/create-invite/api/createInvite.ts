import type { CreateInviteResponse } from "../model/types";
import { apiClient } from "@/shared/api";

export async function createInvite(teamId: number) : Promise<CreateInviteResponse> {
    const response = await apiClient.post(`teams/${teamId}/invites`)
    return response.data as CreateInviteResponse;

}
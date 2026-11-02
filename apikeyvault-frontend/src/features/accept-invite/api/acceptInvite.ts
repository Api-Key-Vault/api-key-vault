import type { AcceptInviteRequest, AcceptInviteResponse } from "../model/types";
import { apiClient } from "@/shared/api";

export async function acceptInvite(data: AcceptInviteRequest): Promise<AcceptInviteResponse>{
    const response = await apiClient.post("invites/accept", data)
    return response.data as AcceptInviteResponse;
}
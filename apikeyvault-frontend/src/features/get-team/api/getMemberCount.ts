import { apiClient } from "@/shared/api";

export async function getMemberCount(): Promise<number> {
    const response = await apiClient.get<number>("teams/members/count");
    return response.data;
}
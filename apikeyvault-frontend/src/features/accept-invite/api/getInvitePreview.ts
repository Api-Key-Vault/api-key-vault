import type { InvitePreviewResponse } from "../model/types";
import { apiClient } from "@/shared/api";

export async function getInvitePreview(
  token: string,
): Promise<InvitePreviewResponse> {
  const response = await apiClient.get<InvitePreviewResponse>(
    "invites/preview",
    {
      params: { token },
    },
  );

  return response.data;
}

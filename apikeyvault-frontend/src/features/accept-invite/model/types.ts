export type AcceptInviteRequest = {
    token: string;
}

export type AcceptInviteResponse = {
    teamId: number;
    teamName: string;
}

export interface InvitePreviewResponse {
  teamName: string;
}
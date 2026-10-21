import { apiClient } from '@/shared/api';
import type { Team, TeamMember } from '../model/types';

export async function getTeam(teamId: number): Promise<Team> {
  const response = await apiClient.get<Team>(`teams/${teamId}`);
  return response.data;
}

export async function getTeamMembers(teamId: number): Promise<TeamMember[]> {
  const response = await apiClient.get<TeamMember[]>(`teams/${teamId}/members`);
  return response.data;
}

export async function removeTeamMember(teamId: number, teamMemberId: number): Promise<void> {
  await apiClient.delete(`teams/${teamId}/members/${teamMemberId}`);
}

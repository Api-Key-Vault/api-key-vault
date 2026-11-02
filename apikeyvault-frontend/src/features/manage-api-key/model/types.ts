import type { ApiKey } from '@/entities/api-key';
import type { ApiKeyAccess } from '@/entities/api-key-access';
import type { TeamMember } from '@/entities/team';

export type ManageKeyUpdate = {
  category: string;
  expiresAt: string;
  name: string;
  value: string;
};

export type ManageKeyModalProps = {
  teamId: number,
  apiKey: ApiKey;
  apiKeyAccesses: ApiKeyAccess[];
  teamMembers: TeamMember[];
  onClose: () => void;
  onRevoke: () => void;
  onSave: (update: ManageKeyUpdate) => void;
  onAddAccess: (teamId: number, apiKeyId: number, teamMemberId: number) => void;
  onRevokeAccess : (teamId: number, access: ApiKeyAccess) => void
  isSubmitting?: boolean;
  error?: string | null;
};

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
  apiKey: ApiKey;
  apiKeyAccesses: ApiKeyAccess[];
  teamMembers: TeamMember[];
  onClose: () => void;
  onRevoke: () => void;
  onSave: (update: ManageKeyUpdate) => void;
  onAddAccess: () => void;
  onRevokeAccess : () => void
  isSubmitting?: boolean;
  error?: string | null;
};

import type { ApiKey } from '@/entities/api-key';

export type ManageKeyUpdate = {
  category: string;
  expiresAt: string;
  name: string;
  value: string;
};

export type ManageKeyModalProps = {
  apiKey: ApiKey;
  onClose: () => void;
  onRevoke: () => void;
  onSave: (update: ManageKeyUpdate) => void;
  isSubmitting?: boolean;
  error?: string | null;
};

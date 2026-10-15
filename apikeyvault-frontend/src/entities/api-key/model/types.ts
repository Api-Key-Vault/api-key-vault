export type ApiKey = {
  id: number;
  name: string;
  addedAt: string;
  visiblePrefix: string;
  maskedValue: string;
  demoValue?: string;
  category?: string;
  expiresAt?: string;
  isRevoked?: boolean;
};

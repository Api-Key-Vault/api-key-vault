import { Card as RetroCard } from "pixel-retroui";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
      <RetroCard
          bg="var(--color-surface)"
          textColor="var(--color-text)"
          shadowColor="var(--color-shadow)"
          borderColor="var(--color-border)"
          className={className}
      >
        {children}
      </RetroCard>
  );
}

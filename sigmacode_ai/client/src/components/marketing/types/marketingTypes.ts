import type { ComponentType } from 'react';

export type BadgeVariant = 'solid' | 'outline' | 'soft';
export type BadgeTone = 'neutral' | 'indigo' | 'success' | 'warning' | 'danger' | 
                 'teal' | 'amber' | 'violet' | 'pink';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  icon?: ComponentType<{ className?: string }>;
  text: string;
  variant?: BadgeVariant;
  tone?: BadgeTone;
  size?: BadgeSize;
  className?: string;
  ariaLabel?: string;
  align?: 'start' | 'center';
  minimal?: boolean;
  hide?: boolean;
  animate?: boolean;
  inViewThreshold?: number;
  animationDelay?: number;
}

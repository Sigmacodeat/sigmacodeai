import type { ComponentType } from 'react';
import { Badge } from '../ui/Badge';

export type BadgeItem = {
  icon?: ComponentType<{ className?: string }>;
  text: string;
  variant?: 'glass' | 'gradient' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: 'neutral' | 'indigo' | 'success' | 'warning' | 'danger' | 'teal' | 'amber' | 'violet' | 'pink';
  className?: string;
  ariaLabel?: string;
};

interface BadgeGroupProps {
  items: BadgeItem[];
  className?: string;
}

/**
 * BadgeGroup: Rendert eine flexible Liste aus Badge-Items.
 * Nutzt den bestehenden UI-Atom `Badge` für konsistenten Look.
 */
export default function BadgeGroup({ items, className = '' }: BadgeGroupProps) {
  return (
    <ul className={`flex flex-wrap items-center gap-1 sm:gap-2 ${className}`}>
      {items.map((b) => (
        <li key={`${b.text}-${b.tone ?? 'neutral'}-${b.variant ?? 'glass'}`}>
          <Badge
            icon={b.icon}
            variant={b.variant}
            size={b.size}
            tone={b.tone}
            className={b.className}
            ariaLabel={b.ariaLabel}
          >
            {b.text}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

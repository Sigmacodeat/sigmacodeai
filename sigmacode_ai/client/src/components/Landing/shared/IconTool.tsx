import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type IconToolProps = {
  icon: LucideIcon;
  size?: number; // px
  color?: string; // stroke color
  className?: string;
  strokeWidth?: number;
};

/**
 * Einheitliche Tool-Icon-Darstellung (Lucide) für Agent-Orbits & Badges.
 * Nutzt stroke-Farbe, keine Füllung, um Brand-Gradienten/Glow nicht zu überdecken.
 */
export default function IconTool({ icon: Icon, size = 18, color = '#38bdf8', className, strokeWidth = 1.5 }: IconToolProps) {
  return (
    <Icon
      aria-hidden
      className={className}
      style={{ width: size, height: size }}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  );
}

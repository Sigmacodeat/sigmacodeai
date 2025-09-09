import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import type { MenuEntry } from './menuConfig';

export type MenuItemProps = {
  entry: MenuEntry;
  active?: boolean;
  variant?: 'mobile' | 'desktop';
  analyticsPrefix?: string; // e.g. header-mobile-products
  onClick?: () => void; // for route items
  onAnchorClick?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
    route?: string,
  ) => void;
};

const baseClasses = {
  mobile: 'flex min-h-[44px] items-center gap-2 rounded px-2 py-2.5 text-sm hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-primary',
  desktop: 'group flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-primary',
};

const activeTextGrad = 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-cyan-200';

export default function MenuItem({ entry, active = false, variant = 'mobile', analyticsPrefix, onClick, onAnchorClick }: MenuItemProps) {
  const Icon: LucideIcon | undefined = entry.icon as LucideIcon | undefined;
  const cls = `${baseClasses[variant]} ${active ? activeTextGrad : ''}`;
  const analyticsId = analyticsPrefix ? `${analyticsPrefix}-${entry.analyticsId}` : entry.analyticsId;

  if (entry.isAnchor) {
    // Render as anchor that can optionally navigate to a route then scroll
    return (
      <a
        href={`#${entry.id}`}
        className={cls}
        onClick={(e) => {
          e.preventDefault();
          if (onClick) onClick();
          onAnchorClick?.(e, entry.id, entry.routeForAnchor ?? entry.to);
        }}
        data-analytics-id={analyticsId}
        role="menuitem"
      >
        {Icon ? <Icon className="h-4 w-4 text-text-secondary" aria-hidden /> : null}
        <span>{entry.label}</span>
      </a>
    );
  }

  if (entry.to) {
    return (
      <Link
        to={entry.to}
        className={cls}
        aria-current={active ? 'page' : undefined}
        onClick={onClick}
        data-analytics-id={analyticsId}
        role="menuitem"
      >
        {Icon ? <Icon className={`h-4 w-4 ${active ? 'text-sky-300' : 'text-text-secondary'}`} aria-hidden /> : null}
        <span>{entry.label}</span>
      </Link>
    );
  }

  // Fallback: non-navigating item
  return (
    <button className={cls} data-analytics-id={analyticsId} role="menuitem" onClick={onClick}>
      {Icon ? <Icon className="h-4 w-4 text-text-secondary" aria-hidden /> : null}
      <span>{entry.label}</span>
    </button>
  );
}

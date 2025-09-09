import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { handleMenuKeyNav } from '../../utils/navigation';

export type DropdownKey = 'produkte' | 'howto' | 'preise' | 'sections';

export type DropdownItem = {
  id: string;
  label: string;
  analyticsId: string;
  icon?: LucideIcon;
  to?: string; // Route
  isAnchor?: boolean; // #hash Ziel
};

export type DropdownProps = {
  name: DropdownKey;
  label: string;
  widthClass?: string; // z.B. w-64, w-72
  items: DropdownItem[];
  isOpen: boolean;
  setOpenMenu: (val: DropdownKey | null) => void;
  clearHoverTimer: () => void;
  scheduleClose: () => void;
  onCloseAll: () => void;
  prefersReduced: boolean;
  buttonActive: boolean;
  isPath: (path: string) => boolean;
  isAnchorActive?: (id: string) => boolean;
  onAnchorClick?: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string,
    route?: string,
  ) => void;
  setTriggerEl?: (el: HTMLButtonElement | null) => void;
  glassClasses?: string; // nur Background/Backdrop-Klassen
  panelBorderClass?: string; // Border-Klassen
  panelShadowClass?: string; // Shadow-Klassen
  analyticsPrefix?: string; // z.B. 'header-menu-products'
};

export default function Dropdown({
  name,
  label,
  widthClass = 'w-64',
  items,
  isOpen,
  setOpenMenu,
  clearHoverTimer,
  scheduleClose,
  onCloseAll,
  prefersReduced,
  buttonActive,
  isPath,
  isAnchorActive,
  onAnchorClick,
  setTriggerEl,
  glassClasses = 'bg-white/40 dark:bg-black/40 bg-gradient-to-b from-white/6 to-white/2 dark:from-white/4 dark:to-white/2 backdrop-blur-xl backdrop-saturate-150 backdrop-contrast-125 border border-white/10 dark:border-white/10',
  panelBorderClass = 'border border-white/10',
  panelShadowClass = 'shadow-[0_12px_40px_rgba(0,0,0,0.25)]',
  analyticsPrefix,
}: DropdownProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close on outside click and on Escape (desktop/mobile)
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      const menuEl = menuRef.current as HTMLElement | null;
      const btnEl = buttonRef.current as HTMLButtonElement | null;
      if (menuEl && btnEl && target && !menuEl.contains(target) && !btnEl.contains(target)) {
        setOpenMenu(null);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        // focus back the trigger for accessibility
        requestAnimationFrame(() => buttonRef.current?.focus());
      }
    };

    // use capture phase for reliability with portals or stopPropagation
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, setOpenMenu]);

  return (
    <div
      className="relative inline-block"
      ref={menuRef as any}
      onMouseEnter={() => {
        clearHoverTimer();
        setOpenMenu(name);
      }}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        const menuEl = menuRef.current as unknown as HTMLElement | null;
        const btnEl = buttonRef.current;
        if (isOpen && next && menuEl && btnEl) {
          if (!menuEl.contains(next) && !btnEl.contains(next)) setOpenMenu(null);
        }
      }}
    >
      <button
        ref={(el) => {
          if (isOpen && setTriggerEl) setTriggerEl(el);
          buttonRef.current = el;
        }}
        id={`btn-${name}`}
        className={`inline-flex items-center gap-1 rounded-md h-9 px-3 text-sm tracking-tight whitespace-nowrap select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-border ${
          buttonActive
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-cyan-200 hover:bg-white/5'
            : 'text-text-secondary hover:bg-white/5'
        }`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={`menu-${name}`}
        data-dropdown-trigger
        onClick={() => setOpenMenu(isOpen ? null : name)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) setOpenMenu(name);
            requestAnimationFrame(() => {
              const first = (menuRef.current as HTMLElement | null)?.querySelector<HTMLElement>('[role="menuitem"]');
              first?.focus();
            });
          }
        }}
      >
        {label}
        <svg className="h-4 w-4 text-text-secondary" viewBox="0 0 24 24" aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          role="menu"
          id={`menu-${name}`}
          aria-labelledby={`btn-${name}`}
          className={`absolute right-0 top-full mt-2 z-50 ${widthClass} overflow-hidden rounded-xl p-1.5 ${panelBorderClass} ${glassClasses} ${panelShadowClass} origin-top-right transform-gpu will-change-transform ring-0 antialiased`}
          onKeyDown={(e) => handleMenuKeyNav(e.nativeEvent, (menuRef.current?.querySelector('[role=menu]') as HTMLElement) ?? (menuRef.current as any))}
          onMouseEnter={clearHoverTimer}
          onMouseLeave={scheduleClose}
          initial={prefersReduced ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.99, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.10, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Caret */}
          <span className="pointer-events-none absolute -top-1.5 right-6 h-3 w-3 rotate-45 bg-black/92 dark:bg-black/85 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.25)]" />

          {/* Scrollbarer Inhalt */}
          <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.to ? isPath(item.to) : (item.isAnchor && isAnchorActive ? isAnchorActive(item.id) : false);
            const commonClass = `group relative flex items-center gap-3 px-5 py-3 text-sm font-medium tracking-tight transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-primary
  ${'text-text-primary/90 hover:text-white hover:bg-white/10'}
   after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:transition-opacity after:duration-200 after:content-[""] hover:after:opacity-0 last:after:hidden
   before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:rounded-full before:bg-gradient-to-b before:from-teal-300/0 before:via-sky-300/70 before:to-cyan-200/0 before:opacity-0 group-hover:before:opacity-100`;

            if (item.to) {
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={commonClass}
                  role="menuitem"
                  onClick={onCloseAll}
                  data-analytics-id={`${analyticsPrefix ?? `header-menu-${name}`}-${item.analyticsId}`}
                >
                  {Icon ? (
                    <Icon className={`h-4 w-4 shrink-0 transition-all duration-300 ${active ? 'text-sky-300' : 'text-text-secondary/80'} group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(125,211,252,0.35)]`} aria-hidden />
                  ) : null}
                  <span className={`relative transition-all duration-200 group-hover:translate-x-1 ${active ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-200 to-cyan-200' : ''}`}>
      {item.label}
    </span>
                </Link>
              );
            }

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active ? 'true' : undefined}
                className={commonClass}
                role="menuitem"
                onClick={(e) => onAnchorClick?.(e as any, item.id, item.to)}
                data-analytics-id={`${analyticsPrefix ?? `header-menu-${name}`}-${item.analyticsId}`}
              >
                {Icon ? (
                  <Icon className={`h-4 w-4 shrink-0 transition-all duration-300 ${active ? 'text-sky-300' : 'text-text-secondary/80'} group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(125,211,252,0.35)]`} aria-hidden />
                ) : null}
                <span className={`relative transition-all duration-200 group-hover:translate-x-1 ${active ? 'text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-200 to-cyan-200' : ''}`}>
      {item.label}
    </span>
              </a>
            );
          })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

import { useEffect } from 'react';

export type UseMenuCloseParams = {
  openMenu: string | null;
  setOpenMenu: (val: string | null) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

/**
 * useMenuClose
 * - Schließt Dropdowns bei Outside-Click
 * - Schließt Dropdowns & Mobile-Drawer bei Escape
 * - Optional: Fokus zurück auf Trigger
 */
export function useMenuClose({ openMenu, setOpenMenu, mobileOpen, setMobileOpen, triggerRef }: UseMenuCloseParams) {
  // Outside click to close dropdowns (ref-agnostic)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!openMenu) return;
      const inMenu = !!target?.closest('[role="menu"]');
      const onTrigger = !!target?.closest('[data-dropdown-trigger]');
      if (!inMenu && !onTrigger) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openMenu, setOpenMenu]);

  // Escape zum Schließen
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (openMenu) {
          e.stopPropagation();
          setOpenMenu(null);
          triggerRef?.current?.focus();
        } else if (mobileOpen) {
          setMobileOpen(false);
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openMenu, mobileOpen, setOpenMenu, setMobileOpen, triggerRef]);
}

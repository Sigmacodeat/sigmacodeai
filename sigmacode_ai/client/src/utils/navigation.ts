// Utilities für Navigation, Anker-Scrolls und Routen-Helfer
// - Keine harten Abhängigkeiten auf konkrete Komponenten

export type ScrollOptions = {
  offset?: number; // positiver Pixel-Offset (z.B. Sticky-Header-Höhe)
  extraGap?: number; // zusätzlicher Abstand unter dem Header
  behavior?: ScrollBehavior;
};

/**
 * Scrollt zu einem Element mit der gegebenen ID unter Berücksichtigung eines Offsets.
 * No-ops, falls DOM nicht vorhanden oder Element fehlt.
 */
export function scrollToId(id: string, opts: ScrollOptions = {}): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const { offset = 0, extraGap = 8, behavior = 'smooth' } = opts;
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const y = Math.max(0, rect.top + window.scrollY - offset - extraGap);
  window.scrollTo({ top: y, behavior });
}

/**
 * Prüft, ob der aktuelle Pfad unter einem Prefix liegt.
 * Beispiel: isUnder('/ai-agents/mas', '/ai-agents') === true
 */
export function isUnder(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + '/') || pathname.startsWith(prefix + '?') || pathname.startsWith(prefix + '#') || pathname.startsWith(prefix);
}

/**
 * Baut eine URL mit Hash aus Pfadname und Anchor-ID.
 */
export function buildHashUrl(pathname: string, id: string): string {
  const clean = id.replace(/^#/, '');
  return `${pathname}#${clean}`;
}

/**
 * Extrahiert die aktuelle Hash-ID aus location.hash (ohne '#').
 */
export function getHashId(hash: string): string {
  return (hash || '').replace(/^#/, '');
}

/**
 * Fokus-Navigation innerhalb eines Menüs mit role="menu" und Items role="menuitem".
 * Unterstützt ArrowDown/ArrowUp/Home/End.
 */
export function handleMenuKeyNav(e: KeyboardEvent, container: HTMLElement | null): void {
  if (!container) return;
  const items = Array.from(container.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  if (items.length === 0) return;

  const currentIndex = items.findIndex((el) => el === document.activeElement);
  const key = e.key;
  let nextIndex: number | null = null;

  if (key === 'ArrowDown') {
    nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
  } else if (key === 'ArrowUp') {
    nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
  } else if (key === 'Home') {
    nextIndex = 0;
  } else if (key === 'End') {
    nextIndex = items.length - 1;
  }

  if (nextIndex != null) {
    e.preventDefault();
    items[nextIndex]?.focus();
  }
}

import { useEffect, useState } from 'react';

export type ActiveSectionOptions = {
  sectionIds: string[];
  /** Offset used for sticky header (px). Positive moves trigger earlier. */
  rootMargin?: string; // e.g. "-96px 0px -60% 0px"
  /** Minimum intersection ratio to consider section active. */
  threshold?: number;
};

/**
 * useActiveSection
 * Tracks which section is currently in view using IntersectionObserver.
 * Respects sticky-header offset via rootMargin to avoid wrong activation.
 */
export function useActiveSection({ sectionIds, rootMargin = '-96px 0px -60% 0px', threshold = 0.2 }: ActiveSectionOptions) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersectionRatio that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible && visible.target.id !== activeId) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin, threshold }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(','), rootMargin, threshold]);

  return activeId;
}

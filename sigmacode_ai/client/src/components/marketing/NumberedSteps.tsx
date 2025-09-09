import type { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '~/utils';

export interface NumberedStep {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

interface NumberedStepsProps {
  steps: NumberedStep[];
  className?: string;
  startIndex?: number;
  /** Optional Header über der Liste (z. B. Section-Badge steht außerhalb) */
  header?: ReactNode;
  /** Anzahl Spalten ab md. Standard: 3 */
  colsMd?: 2 | 3;
  /** Optionaler i18n-Key-Override für den sichtbaren Prefix (z. B. "Phase" statt "Schritt") */
  prefixKeyOverride?: string;
  /** Optionaler i18n-Key-Override für das ARIA-Label */
  ariaKeyOverride?: string;
}

/**
 * Nummerierte, barrierearme Steps-Komponente für How-It-Works Unterseiten.
 * - Semantisch als <ol>
 * - ARIA-Label pro Eintrag: "Step n of total: <title>"
 * - Konsistente Glass-Card-Optik wie bestehende Karten
 */
export default function NumberedSteps({
  steps,
  className,
  startIndex = 1,
  header,
  colsMd = 3,
  prefixKeyOverride,
  ariaKeyOverride,
}: NumberedStepsProps) {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;

  const total = steps.length;
  const gridCols = colsMd === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <section className={cn('mt-8', className)} aria-labelledby="numbered-steps-title">
      {header}
      {/* Hidden heading for accessibility and landmarks */}
      <h2 id="numbered-steps-title" className="sr-only">
        {tt('marketing.howto.meta.title')}
      </h2>
      <ol className={cn('grid grid-cols-1 gap-4 sm:gap-5', gridCols)}>
        {steps.map((s, idx) => {
          const n = startIndex + idx;
          const ariaKey = ariaKeyOverride ?? 'marketing.howto.steps.aria';
          const aria = tt(ariaKey, { n, total, title: s.title });
          return (
            <li key={`${n}-${s.title}`} aria-label={aria} className="relative">
              <div className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow focus-within:shadow outline-none focus-within:ring-2 focus-within:ring-brand-primary/40 rounded-xl">
                {/* Header row: step pill, icon, title in one line */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full bg-brand-primary/10 px-2.5 text-[12px] font-semibold text-brand-primary ring-1 ring-brand-primary/30 shadow-inner"
                  >
                    {tt(prefixKeyOverride ?? 'marketing.howto.steps.prefix')} {n}
                  </span>
                  {s.icon ? <s.icon className="h-5 w-5 shrink-0 text-brand-primary" /> : null}
                  <h3 className="font-semibold text-sm md:text-[15px] leading-tight break-words line-clamp-2" title={s.title}>{s.title}</h3>
                </div>

                {/* Body */}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

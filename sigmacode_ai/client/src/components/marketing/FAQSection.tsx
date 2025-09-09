import React, { useEffect } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '~/utils';
import { Accordion, AccordionItem, AccordionContent } from '@librechat/client';
import SectionBadge from './SectionBadge';
import type { BadgeVariant } from '../ui/Badge';

export type FAQItem = {
  q: string;
  a: React.ReactNode;
  keywords?: string[];
};

interface FAQSectionProps {
  id?: string;
  title?: string;
  items: FAQItem[];
  className?: string;
  /**
   * URL Pfad zur Seite (z. B. '/business-ai'). Für JSON-LD mainEntityOfPage
   */
  pagePath?: string;
  /**
   * Aktiviert JSON-LD FAQPage Markup basierend auf items
   */
  enableStructuredData?: boolean;
  /**
   * Visuelle Variante: 'default' (bisherig) oder 'compact' (enger, edler)
   */
  variant?: 'default' | 'compact';
  /**
   * Layout der Darstellung: 'accordion' (Standard) oder 'cards' (Kartenraster)
   */
  layout?: 'accordion' | 'cards';
  /**
   * Optionaler Untertitel unter der Überschrift
   */
  subtitle?: string;
  /**
   * Optionales Badge oberhalb der Überschrift
   */
  badgeText?: string;
  badgeIcon?: React.ComponentType<any>;
  badgeVariant?: BadgeVariant;
}

function stripHtml(input: string) {
  if (typeof window === 'undefined') return input;
  const tmp = document.createElement('div');
  tmp.innerHTML = input;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

export default function FAQSection({
  id = 'faq',
  title = 'FAQ',
  items,
  className,
  pagePath,
  enableStructuredData = true,
  variant = 'default',
  layout = 'accordion',
  subtitle,
  badgeText,
  badgeIcon,
  badgeVariant = 'outline',
}: FAQSectionProps) {
  useEffect(() => {
    if (!enableStructuredData || items.length === 0) return;
    try {
      const origin = window.location.origin;
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((f) => ({
          '@type': 'Question',
          name: typeof f.q === 'string' ? f.q : stripHtml(String(f.q)),
          acceptedAnswer: {
            '@type': 'Answer',
            text: stripHtml(
              typeof f.a === 'string' ? f.a : (typeof f.a === 'object' ? (document.createElement('div').appendChild(document.createTextNode('')).textContent ?? '') : String(f.a))
            ),
          },
        })),
        ...(pagePath
          ? { mainEntityOfPage: { '@type': 'WebPage', '@id': origin + pagePath } }
          : {}),
      });
      document.head.appendChild(script);
      return () => script.remove();
    } catch {
      // fail silently – UI bleibt funktionsfähig
    }
  }, [enableStructuredData, items, pagePath]);

  return (
    <section
      id={id}
      className={cn(
        'border-t dark:border-gray-900',
        variant === 'compact' ? 'py-10 border-gray-100/70' : 'py-16 border-gray-100',
        className,
      )}
      aria-labelledby={`${id}-title`}
    >
      {badgeText && (
        <SectionBadge icon={badgeIcon} variant={badgeVariant}>
          {badgeText}
        </SectionBadge>
      )}
      <h2
        id={`${id}-title`}
        className={cn(
          'text-gray-900 dark:text-gray-50',
          variant === 'compact' ? 'text-xl font-semibold' : 'text-2xl font-bold',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-gray-600 dark:text-gray-300', variant === 'compact' ? 'mt-1.5 text-[13.5px]' : 'mt-2 text-sm')}>
          {subtitle}
        </p>
      )}

      {layout === 'accordion' ? (
        <div className={cn('mx-auto max-w-3xl', variant === 'compact' ? 'mt-4' : 'mt-6')}>
          <Accordion
            type="multiple"
            className={cn(
              'rounded-xl bg-white dark:bg-gray-900',
              variant === 'compact'
                ? 'border border-gray-200/70 dark:border-gray-800/70 divide-y divide-gray-200/70 dark:divide-gray-800/70 shadow-sm'
                : 'border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800',
            )}
          >
            {items.map((f, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className={cn('border-none', variant === 'compact' ? 'px-3' : 'px-4')}
              >
                <AccordionPrimitive.Header asChild>
                  <AccordionPrimitive.Trigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center justify-between text-left transition-colors',
                        variant === 'compact' ? 'gap-3 py-3' : 'gap-4 py-4',
                        'text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800/80',
                        'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
                      )}
                      aria-label={`Frage: ${typeof f.q === 'string' ? f.q : ''}`}
                    >
                      <span className={cn('font-medium', variant === 'compact' ? 'text-[15px]' : 'text-base')}>{f.q}</span>
                      <ChevronDown className={cn('shrink-0 transition-transform text-gray-500 dark:text-gray-400 data-[state=open]:rotate-180', variant === 'compact' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
                    </button>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>

                <AccordionContent className={cn('pt-0', variant === 'compact' ? 'pb-3' : 'pb-4')}>
                  <div
                    className={cn(
                      'prose prose-teal dark:prose-invert max-w-none',
                      variant === 'compact' ? 'text-[13px] leading-snug' : 'text-sm leading-relaxed',
                    )}
                  >
                    {f.a}
                  </div>
                  {variant !== 'compact' && f.keywords && f.keywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {f.keywords.map((k) => (
                        <span
                          key={k}
                          className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <div className={cn('mt-6 grid grid-cols-1 gap-3 sm:gap-4 md:gap-4 md:grid-cols-2', variant === 'compact' ? '' : 'max-w-5xl')}
        >
          {items.map((f, i) => (
            <div key={`faq-card-${i}`} className={cn('ui-glass-card p-3 sm:p-4', variant === 'compact' ? 'text-[13.5px]' : 'text-sm')}>
              <h3 className={cn('font-medium leading-tight', variant === 'compact' ? 'text-[13.5px] sm:text-[15px]' : 'text-base')}>{f.q}</h3>
              <div className={cn('mt-1.5 text-gray-600 dark:text-gray-300', variant === 'compact' ? 'text-[13px] sm:text-[15px] leading-snug' : 'leading-relaxed')}>{f.a}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

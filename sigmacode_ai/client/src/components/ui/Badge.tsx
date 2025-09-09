import type { ComponentType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/utils';

export type BadgeVariant = 'glass' | 'gradient' | 'outline';

const badgeStyles = cva(
  // base
  'inline-flex items-center rounded-full font-medium tracking-tight will-change-transform transition-colors motion-safe:transition-all motion-safe:duration-200 gap-1.5 sm:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/70 dark:focus-visible:ring-teal-300/60 focus-visible:ring-offset-0 dark:focus-visible:ring-offset-0 no-underline',
  {
    variants: {
      variant: {
        glass:
          // On mobile: remove border/shadow to avoid row-wide underline effect; restore from sm
          'bg-white/60 text-gray-800 shadow-none border border-transparent backdrop-blur-sm hover:bg-white/70 sm:shadow-sm sm:hover:shadow-md sm:border-white/70 dark:bg-gray-900/40 dark:text-gray-100 dark:border-transparent dark:hover:bg-gray-900/55 dark:sm:border-gray-700/70',
        gradient:
          'text-white shadow-sm ring-1 ring-white/10 dark:ring-black/10 border border-white/15 dark:border-white/10',
        outline:
          // Neutral-outline as base; colored tones are provided via compoundVariants below
          'border border-neutral-300/70 text-neutral-800 hover:text-neutral-900 hover:border-neutral-400/80 dark:text-neutral-200 dark:border-neutral-700/60 dark:hover:border-neutral-500/80 dark:hover:text-white',
      },
      size: {
        xs: 'px-2 py-0.5 text-[10px] sm:text-[11px]',
        sm: 'px-2.5 py-1 text-[11px] sm:text-[11px]',
        // Make md even more compact on mobile; scale up from sm breakpoint
        md: 'px-2 py-0.5 text-[10.5px] sm:px-3 sm:py-1.5 sm:text-xs',
        lg: 'px-3.5 py-2 text-xs sm:text-sm',
      },
      tone: {
        neutral: '',
        indigo: '',
        success:
          'data-[tone=success]:border-green-300/70 data-[tone=success]:text-green-700 dark:data-[tone=success]:text-green-300',
        warning:
          'data-[tone=warning]:border-amber-300/70 data-[tone=warning]:text-amber-800 dark:data-[tone=warning]:text-amber-300',
        danger:
          'data-[tone=danger]:border-red-300/70 data-[tone=danger]:text-red-700 dark:data-[tone=danger]:text-red-300',
        teal: '',
        amber: '',
        violet: '',
        pink: '',
      },
      interactive: {
        true: 'hover:scale-[1.02] active:scale-[0.99]',
        false: '',
      },
    },
    compoundVariants: [
      // Aurora gradient surface
      {
        variant: 'gradient',
        class:
          // Einheitlicher Kontrast-Verlauf (linksgerichtet) wie der Brand-Title
          'bg-gradient-to-l from-teal-500 via-sky-300 to-cyan-100 dark:from-teal-400 dark:via-sky-300 dark:to-cyan-100',
      },
      // Glass tones: subtle colored glass with readable contrast
      {
        variant: 'glass',
        tone: 'indigo',
        class:
          // Indigo tone styled with blue/sky to match brand title colors
          'data-[tone=indigo]:bg-sky-50/70 data-[tone=indigo]:text-blue-800 data-[tone=indigo]:border-sky-200/70 dark:data-[tone=indigo]:bg-sky-500/10 dark:data-[tone=indigo]:text-sky-200 dark:data-[tone=indigo]:border-sky-700/50',
      },
      {
        variant: 'glass',
        tone: 'teal',
        class: 'data-[tone=teal]:bg-teal-50/70 data-[tone=teal]:text-teal-800 data-[tone=teal]:border-teal-200/70 dark:data-[tone=teal]:bg-teal-500/10 dark:data-[tone=teal]:text-teal-200 dark:data-[tone=teal]:border-teal-700/50',
      },
      {
        variant: 'glass',
        tone: 'amber',
        class: 'data-[tone=amber]:bg-amber-50/70 data-[tone=amber]:text-amber-900 data-[tone=amber]:border-amber-200/70 dark:data-[tone=amber]:bg-amber-500/10 dark:data-[tone=amber]:text-amber-200 dark:data-[tone=amber]:border-amber-700/50',
      },
      {
        variant: 'glass',
        tone: 'violet',
        class: 'data-[tone=violet]:bg-violet-50/70 data-[tone=violet]:text-violet-800 data-[tone=violet]:border-violet-200/70 dark:data-[tone=violet]:bg-violet-500/10 dark:data-[tone=violet]:text-violet-200 dark:data-[tone=violet]:border-violet-700/50',
      },
      {
        variant: 'glass',
        tone: 'pink',
        class: 'data-[tone=pink]:bg-pink-50/70 data-[tone=pink]:text-pink-800 data-[tone=pink]:border-pink-200/70 dark:data-[tone=pink]:bg-pink-500/10 dark:data-[tone=pink]:text-pink-200 dark:data-[tone=pink]:border-pink-700/50',
      },
      // Outline tones: colored text/border
      {
        variant: 'outline',
        tone: 'teal',
        class: 'data-[tone=teal]:border-teal-300/70 data-[tone=teal]:text-teal-700 dark:data-[tone=teal]:text-teal-300 dark:data-[tone=teal]:border-teal-700/60',
      },
      {
        variant: 'outline',
        tone: 'amber',
        class: 'data-[tone=amber]:border-amber-300/70 data-[tone=amber]:text-amber-800 dark:data-[tone=amber]:text-amber-300 dark:data-[tone=amber]:border-amber-700/60',
      },
      {
        variant: 'outline',
        tone: 'violet',
        class: 'data-[tone=violet]:border-violet-300/70 data-[tone=violet]:text-violet-700 dark:data-[tone=violet]:text-violet-300 dark:data-[tone=violet]:border-violet-700/60',
      },
      {
        variant: 'outline',
        tone: 'pink',
        class: 'data-[tone=pink]:border-pink-300/70 data-[tone=pink]:text-pink-700 dark:data-[tone=pink]:text-pink-300 dark:data-[tone=pink]:border-pink-700/60',
      },
      {
        variant: 'outline',
        tone: 'indigo',
        class: 'data-[tone=indigo]:border-sky-300/70 data-[tone=indigo]:text-blue-800 dark:data-[tone=indigo]:text-sky-300 dark:data-[tone=indigo]:border-sky-700/60',
      },
    ],
    defaultVariants: {
      variant: 'glass',
      size: 'md',
      tone: 'neutral',
      interactive: true,
    },
  },
);

type BadgeProps = {
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
} & VariantProps<typeof badgeStyles> & {
  // Backward compatibility: keep existing `variant?: BadgeVariant`
  variant?: BadgeVariant;
};

/**
 * Reusable Badge component with light/dark-safe styles.
 * Variants: glass | gradient | outline
 * Extras: size (sm|md|lg), tone, interactive hover/press, improved focus ring.
 */
export function Badge({
  icon: Icon,
  children,
  variant = 'glass',
  size = 'md',
  tone = 'neutral',
  interactive = true,
  className = '',
  ariaLabel,
}: BadgeProps) {
  return (
    <span
      data-tone={tone}
      className={cn(badgeStyles({ variant, size, tone, interactive }), className)}
      aria-label={ariaLabel}
    >
      {Icon ? <Icon className="h-3 w-3 sm:h-4 sm:w-4" /> : null}
      {children}
    </span>
  );
}

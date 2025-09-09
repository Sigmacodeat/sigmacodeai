import React from 'react';
import { cn } from '~/utils';

export type UIButtonVariant = 'primary' | 'secondary' | 'ghost';

// Centralized CTA styles to ensure visual consistency across Landing
export const buttonStyles: Record<UIButtonVariant, string> = {
  primary:
    'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 dark:focus-visible:ring-offset-0 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 focus-visible:ring-teal-500/70 dark:focus-visible:ring-teal-300/60',
  secondary:
    'not-prose no-underline visited:no-underline hover:no-underline focus:no-underline inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 dark:focus-visible:ring-offset-0 !text-teal-300 visited:!text-teal-300 hover:!text-teal-200 focus:!text-teal-200 active:!text-teal-200 border border-teal-400/30 bg-white/0 dark:bg-white/0 hover:bg-teal-500/10 focus-visible:ring-teal-500/70 dark:focus-visible:ring-teal-300/60',
  ghost:
    'not-prose no-underline visited:no-underline hover:no-underline focus:no-underline inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 dark:focus-visible:ring-offset-0 !text-teal-300 visited:!text-teal-300 hover:!text-teal-200 focus:!text-teal-200 active:!text-teal-200 border border-teal-400/30 bg-transparent hover:bg-teal-500/10 focus-visible:ring-teal-500/70 dark:focus-visible:ring-teal-300/60',
};

// Mobile-first XS sizing per variant; escalates back to default at sm+
export const buttonSizeXs: Record<UIButtonVariant, string> = {
  primary: 'px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm',
  secondary: 'px-3 py-2 text-xs sm:px-4 sm:py-2.5 sm:text-sm',
  ghost: 'px-2.5 py-1.5 text-[12px] sm:px-3 sm:text-[13px]',
};

export type UIButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: UIButtonVariant;
};

/**
 * Minimaler, generischer Button für UI-Barrel-Exports
 * - Akzeptiert Standard-Button-Props
 * - Bewahrt Klassenkette via `cn`
 */
export const Button: React.FC<UIButtonProps> = ({ className, children, variant, ...props }) => {
  return (
    <button
      type={props.type ?? 'button'}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-2 py-1',
        variant ? buttonStyles[variant] : undefined,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

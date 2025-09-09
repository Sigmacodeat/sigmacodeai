import React, { forwardRef } from 'react';

type ElementTag = keyof JSX.IntrinsicElements;

export type CardVariant = 'default' | 'muted' | 'solid' | 'glass' | 'outline' | 'subtle' | 'elevated' | 'bare';
export type CardSize = 'sm' | 'md' | 'lg';

export type CardProps<T extends ElementTag = 'div'> = {
  as?: T;
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  noInner?: boolean;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const sizeClasses: Record<CardSize, string> = {
  sm: 'rounded-xl',
  md: 'rounded-2xl',
  lg: 'rounded-3xl',
};

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-zinc-300/15',
  muted:
    'bg-zinc-50/90 dark:bg-zinc-800/60 ring-1 ring-black/5 dark:ring-zinc-300/15 backdrop-blur-sm',
  // Einheitlich dunkle Surface, unabhängig vom Theme – wie in den Marketing-FeatureCards
  solid:
    'bg-zinc-900/95 text-white ring-1 ring-zinc-300/15',
  glass:
    'ui-glass-card ui-glass-card-hover',
  outline:
    'bg-transparent ring-1 ring-black/10 dark:ring-zinc-300/20',
  subtle:
    'bg-zinc-50/80 dark:bg-zinc-800/60 ring-1 ring-black/5 dark:ring-zinc-300/15 backdrop-blur',
  elevated:
    'bg-white/70 dark:bg-zinc-900/50 ring-1 ring-black/5 dark:ring-zinc-300/15 backdrop-blur-sm shadow-sm',
  bare:
    'bg-transparent ring-0',
};

const interactiveClasses =
  'transition-[box-shadow,transform,background-color] duration-200 ease-out will-change-transform ' +
  'hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md focus-visible:shadow-md ' +
  'hover:ring-black/10 dark:hover:ring-zinc-300/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ' +
  'motion-reduce:transition-none motion-reduce:hover:shadow-none motion-reduce:focus:shadow-none';

const baseClasses =
  'antialiased select-none ring-offset-0';

const InnerPadding = {
  sm: 'p-3.5 sm:p-4',
  md: 'p-5 md:p-6',
  lg: 'p-5 sm:p-6',
} as const;

function _Card<T extends ElementTag = 'div'>(
  {
    as,
    variant = 'default',
    size = 'md',
    interactive = false,
    noInner = false,
    className,
    children,
    ...rest
  }: CardProps<T>,
  ref: React.Ref<Element>
) {
  const As = (as || 'div') as any;

  const outer = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    interactive && interactiveClasses,
    className
  );

  return (
    <As ref={ref as any} className={outer} {...rest}>
      {noInner ? children : <div className={InnerPadding[size]}>{children}</div>}
    </As>
  );
}

const Card = forwardRef(_Card) as <T extends ElementTag = 'div'>(
  props: CardProps<T> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;
export default Card;
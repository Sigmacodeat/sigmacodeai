import React from 'react';
import Reveal from './Reveal';

export type StaggerProps = {
  children: React.ReactNode;
  gap?: number; // ms between children
  startDelay?: number; // ms before first child
  variant?: 'rise' | 'fade' | 'scale';
  duration?: number; // optional uniform duration
  once?: boolean;
  as?: React.ElementType;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

/**
 * Stagger: sequences its direct children with incremental delays.
 * - If a child is a <Reveal>, we merge/offset its delay.
 * - Otherwise, we wrap the child in <Reveal> with the computed delay.
 * - IMPORTANT: For semantic lists, we DO NOT wrap <li> elements to keep valid HTML.
 */
export default function Stagger({
  children,
  gap = 80,
  startDelay = 0,
  variant = 'rise',
  duration,
  once = true,
  as: As = 'div',
  className = '',
  ...rest
}: StaggerProps) {
  const items = React.Children.toArray(children);

  return (
    <As className={className} {...rest}>
      {items.map((child, idx) => {
        const delay = startDelay + idx * gap;

        // Keep semantic list structure intact, but animate contents
        if (React.isValidElement(child) && typeof child.type === 'string' && child.type.toLowerCase() === 'li') {
          const li = child as React.ReactElement<any>;
          const liChildren = React.Children.toArray(li.props.children);

          if (liChildren.length === 1 && React.isValidElement(liChildren[0]) && (liChildren[0] as any).type?.displayName === 'Reveal') {
            // Merge delay into existing Reveal inside li
            const innerReveal = liChildren[0] as React.ReactElement<any>;
            const prevDelay = (innerReveal.props?.delay ?? 0) as number;
            const merged = React.cloneElement(innerReveal, {
              delay: prevDelay + delay,
              variant: innerReveal.props?.variant ?? variant,
              duration: innerReveal.props?.duration ?? duration,
              once: innerReveal.props?.once ?? once,
            });
            return React.cloneElement(li, { key: li.key ?? idx }, merged);
          }

          // Wrap li children in a Reveal to apply delay
          return React.cloneElement(
            li,
            { key: li.key ?? idx },
            <Reveal delay={delay} variant={variant} duration={duration} once={once}>
              {li.props.children}
            </Reveal>
          );
        }

        if (React.isValidElement(child) && (child.type as any)?.displayName === 'Reveal') {
          const prevDelay = (child.props as any).delay ?? 0;
          return React.cloneElement(child as any, {
            delay: prevDelay + delay,
            variant: (child.props as any).variant ?? variant,
            duration: (child.props as any).duration ?? duration,
            once: (child.props as any).once ?? once,
            key: (child as any).key ?? idx,
          });
        }

        return (
          <Reveal
            key={(child as any)?.key ?? idx}
            delay={delay}
            variant={variant}
            duration={duration}
            once={once}
          >
            {child}
          </Reveal>
        );
      })}
    </As>
  );
}

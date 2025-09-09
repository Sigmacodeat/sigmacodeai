import React, { useContext, useMemo, useState } from 'react';
import { ThemeContext } from '@librechat/client';
import { Monitor, Moon, Sun } from 'lucide-react';

/**
 * Kompakter Theme Toggle (System/Light/Dark)
 * - Nutzung des globalen ThemeContext aus @librechat/client
 * - Zyklischer Wechsel: system -> light -> dark -> system
 * - A11y: Aria-Labels, Tastatur bedienbar
 */
const order: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark'];

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [pressed, setPressed] = useState(false);

  const idx = useMemo(() => Math.max(0, order.indexOf((theme as any) ?? 'system')), [theme]);
  const nextTheme = useMemo(() => order[(idx + 1) % order.length], [idx]);

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const label = theme === 'dark' ? 'Dark Mode' : theme === 'light' ? 'Light Mode' : 'System Theme';

  return (
    <button
      type="button"
      aria-label={`Theme wechseln (aktuell: ${label})`}
      title={`Theme wechseln (aktuell: ${label})`}
      className={`inline-flex items-center justify-center rounded-full border border-border bg-transparent p-2 text-text-secondary shadow-sm transition hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-border ${className}`}
      onClick={() => setTheme(nextTheme)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setTheme(nextTheme);
        }
      }}
    >
      <Icon className={`h-4 w-4 transition-transform ${pressed ? 'scale-90' : 'scale-100'}`} />
    </button>
  );
}

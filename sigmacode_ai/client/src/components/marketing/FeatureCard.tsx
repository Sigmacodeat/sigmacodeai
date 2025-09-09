import React from 'react';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import Card from '~/components/Landing/components/Card';

export interface FeatureCardProps {
  icon?: LucideIcon;
  title: string;
  desc: string;
  eyebrow?: string;
  className?: string;
}

/**
 * FeatureCard – generische, wiederverwendbare Karte für Marketing-Features
 * - Minimalistische, zugängliche Darstellung
 * - Fokus-Styles für Keyboard-Nutzung
 */
export default function FeatureCard({ icon: Icon, title, desc, eyebrow, className }: FeatureCardProps) {
  return (
    <Card
      variant="solid"
      size="md"
      interactive
      className={clsx('p-5 sm:p-6', className)}
      role="group"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon && <Icon className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" aria-hidden="true" />}
        <div className="flex-1">
          {eyebrow && (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {eyebrow}
            </span>
          )}
          <h3 className={`font-semibold ${eyebrow ? 'mt-1.5' : 'mt-0'}`}>{title}</h3>
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
    </Card>
  );
}


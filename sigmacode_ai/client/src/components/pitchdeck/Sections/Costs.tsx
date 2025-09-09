import { motion, useInView, useReducedMotion } from 'framer-motion';
import { containerVar, SectionTitle } from './_shared';
import React, { useEffect, useState, useRef } from 'react';
import { z } from 'zod';

export type CostsProps = {
  data: { name: string; value: number }[];
  chartColors: { axisTick: string; axisLine: string; grid: string; tooltipBg: string; tooltipText: string; bar: string };
  isDark: boolean;
};

export default function Costs({ data, chartColors, isDark }: CostsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Lazy-load Recharts only when this section mounts on client
  const [Recharts, setRecharts] = useState<null | typeof import('recharts')>(null);
  useEffect(() => {
    let active = true;
    import('recharts')
      .then((mod) => {
        if (active) setRecharts(mod);
      })
      .catch(() => {
        // Optional: silently fail, we will render a placeholder
      });
    return () => {
      active = false;
    };
  }, []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartInView = useInView(containerRef, { amount: 0.5, once: true });
  const prefersReduced = useReducedMotion();
  const enableMotion = mounted && !prefersReduced;

  // Formatierung für Werte (kompakt, z. B. 1,2 Mio.)
  const numberFmt = React.useMemo(() =>
    new Intl.NumberFormat('de-DE', { notation: 'compact', maximumFractionDigits: 1 }),
  []);
  const yTickFormatter = (v: number) => numberFmt.format(v);

  // Zod-Validierung der Daten (runtime-guard)
  const DataPointSchema = z.object({ name: z.string().min(1), value: z.number().finite() });
  const DataArraySchema = z.array(DataPointSchema).max(1000);
  const parsed = React.useMemo(() => DataArraySchema.safeParse(data), [data]);
  const chartData = parsed.success ? parsed.data : [];
  if (!parsed.success && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[Costs] Ungültige Daten, zeige Placeholder:', parsed.error?.issues);
  }

  if (!mounted) {
    return (
      <section id="Kosten" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800" role="region" aria-labelledby="costs-title">
        <motion.div variants={containerVar} initial={enableMotion ? 'hidden' : false} whileInView={enableMotion ? 'show' : undefined} viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle id="costs-title">Kostenstruktur (2 Jahre)</SectionTitle>
          <div className="w-full h-[300px] bg-gray-100/70 dark:bg-gray-700 rounded-md" />
        </motion.div>
      </section>
    );
  }
  // Leere Daten – Placeholder statt Chart
  const isEmpty = chartData.length === 0;

  return (
    <section id="Kosten" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800" role="region" aria-labelledby="costs-title">
      <motion.div ref={containerRef} variants={containerVar} initial={enableMotion ? 'hidden' : false} whileInView={enableMotion ? 'show' : undefined} viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle id="costs-title">Kostenstruktur (2 Jahre)</SectionTitle>
        <motion.div
          initial={enableMotion ? { opacity: 0, scale: 0.98 } : false}
          whileInView={enableMotion ? { opacity: 1, scale: 1 } : undefined}
          viewport={{ once: true, amount: 0.3 }}
          transition={enableMotion ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : undefined}
          className="w-full h-[300px]"
          role="img"
          aria-label="Balkendiagramm der Kostenstruktur über 2 Jahre"
          aria-describedby="costs-caption"
        >
          {isEmpty || !Recharts ? (
            <div
              className="h-full w-full rounded-md bg-gray-100/70 dark:bg-gray-700 grid place-items-center text-sm text-gray-600 dark:text-gray-300"
              aria-live="polite"
            >
              {isEmpty ? 'Keine Daten verfügbar' : 'Lade Diagramm …'}
            </div>
          ) : (
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart data={chartData} margin={{ top: 5, right: 16, left: -10, bottom: 0 }}>
                <Recharts.CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <Recharts.XAxis dataKey="name" stroke={chartColors.axisLine} tick={{ fill: chartColors.axisTick }} interval={0} angle={0} dy={6} />
                <Recharts.YAxis stroke={chartColors.axisLine} tick={{ fill: chartColors.axisTick }} tickFormatter={yTickFormatter} allowDecimals domain={[0, 'auto']} />
                <Recharts.Tooltip
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.axisLine, color: chartColors.tooltipText }}
                  labelStyle={{ color: chartColors.tooltipText }}
                  itemStyle={{ color: chartColors.tooltipText }}
                  formatter={(value: number) => numberFmt.format(value)}
                />
                <Recharts.Bar
                  dataKey="value"
                  fill={chartColors.bar}
                  fillOpacity={chartInView ? 0.95 : 0.65}
                  stroke={chartInView ? chartColors.bar : 'transparent'}
                  strokeWidth={chartInView ? 1.5 : 0}
                  isAnimationActive={enableMotion && chartInView}
                  animationDuration={enableMotion ? 400 : 0}
                />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          )}
        </motion.div>
        <p id="costs-caption" className="mt-4 text-gray-600 dark:text-gray-300">Gesamtvolumen: ~1,1 Mio. €</p>
      </motion.div>
    </section>
  );
}

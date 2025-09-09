import { motion, useInView } from 'framer-motion';
import { containerVar, SectionTitle } from './_shared';
import React, { useEffect, useState, useRef } from 'react';

export type FinancialsProps = {
  data: { year: number; revenue: number }[];
  chartColors: { axisTick: string; axisLine: string; grid: string; tooltipBg: string; tooltipText: string; bar: string };
  isDark: boolean;
};

export default function Financials({ data, chartColors, isDark }: FinancialsProps) {
  // Render-Guard: Recharts kann beim allerersten Render/Hydration Probleme verursachen,
  // daher erst nach Client-Mount rendern.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Lazy-load Recharts on client
  const [Recharts, setRecharts] = useState<null | typeof import('recharts')>(null);
  useEffect(() => {
    let active = true;
    import('recharts')
      .then((mod) => {
        if (active) setRecharts(mod);
      })
      .catch(() => {
        // optional noop
      });
    return () => {
      active = false;
    };
  }, []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartInView = useInView(containerRef, { amount: 0.5, once: false });

  if (!mounted) {
    return (
      <section id="Financials" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Financials (Projektion)</SectionTitle>
          <div className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-md" />
        </motion.div>
      </section>
    );
  }
  return (
    <section id="Financials" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
      <motion.div ref={containerRef} variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Financials (Projektion)</SectionTitle>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: 'easeOut' }} className="w-full h-[300px]">
          {!Recharts ? (
            <div className="h-full w-full rounded-md bg-gray-100 dark:bg-gray-800 grid place-items-center text-sm text-gray-600 dark:text-gray-300" aria-live="polite">Lade Diagramm …</div>
          ) : (
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.LineChart data={data} margin={{ top: 5, right: 16, left: -10, bottom: 0 }}>
                <Recharts.CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <Recharts.XAxis dataKey="year" stroke={chartColors.axisLine} tick={{ fill: chartColors.axisTick }} />
                <Recharts.YAxis unit=" M€" stroke={chartColors.axisLine} tick={{ fill: chartColors.axisTick }} />
                <Recharts.Tooltip
                  cursor={{ stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.axisLine, color: chartColors.tooltipText }}
                  labelStyle={{ color: chartColors.tooltipText }}
                  itemStyle={{ color: chartColors.tooltipText }}
                  formatter={(v: number) => [`${v.toFixed(2)} M€`, 'Umsatz']}
                />
                <Recharts.Legend />
                <Recharts.Line
                  type="monotone"
                  dataKey="revenue"
                  name="Umsatz"
                  stroke={chartColors.bar}
                  strokeWidth={chartInView ? 3.5 : 2.5}
                  dot={{ r: chartInView ? 4 : 2.5 }}
                  activeDot={{ r: 5 }}
                  animationDuration={400}
                />
              </Recharts.LineChart>
            </Recharts.ResponsiveContainer>
          )}
        </motion.div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Break-even: 2029 • 2027: €1.15M • 2030: €28M</p>
      </motion.div>
    </section>
  );
}


import React, { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import ParallaxRobot from '../Shared/ParallaxRobot';
import ClientOnly from '../Shared/ClientOnly';

function RoadmapContent() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stickyRef, offset: ['start start', 'end end'] });
  const prefersReduced = useReducedMotion();

  // Pfad-Animation: wächst entlang der Scroll-Progression
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  // Milestones: Aktivierung bei Segment-Progress
  const milestones = useMemo(
    () => [
      { id: 'ms-1', year: '2025–2026', title: 'Softwareprototyp + Integration' },
      { id: 'ms-2', year: '2026–2027', title: 'Pilotprojekte (Pflegeheim, Hotel, Haushalt)' },
      { id: 'ms-3', year: '2027+', title: 'Marktstart Robot-as-a-Service (Österreich/EU)' },
      { id: 'ms-4', year: '2028+', title: 'Skalierung international' },
    ],
    [],
  );

  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(milestones.length - 1, Math.max(0, Math.floor(v * milestones.length))),
  );

  return (
    <>
      {/* Parallax-Robot als subtiler Hintergrund */}
      <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="max-h-[120vh]" opacity={0.07} />

      {/* Sticky Bühne */}
      <div ref={stickyRef} className="sticky top-0 h-screen flex items-center" aria-hidden={prefersReduced ? undefined : undefined}>
        <motion.div
          variants={containerVar}
          initial={prefersReduced ? false : 'hidden'}
          whileInView={prefersReduced ? undefined : 'show'}
          viewport={{ once: true, amount: 0.1 }}
          className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-12"
        >
          {/* Linke Spalte: Titel + Legende */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <SectionTitle id="roadmap-title">Roadmap & Meilensteine</SectionTitle>
            <p className="text-gray-500 dark:text-gray-400 max-w-prose">
              Ein roter Faden führt durch unsere Entwicklungsphasen. Beim Scrollen wächst die Road, und Stationen werden aktiv.
            </p>
            <ul className="mt-6 space-y-3">
              {milestones.map((m, i) => (
                <motion.li
                  key={m.id}
                  variants={itemVar}
                  className="flex items-start gap-3"
                  style={{ opacity: prefersReduced ? 1 : useTransform(activeIndex, (x) => (x >= i ? 1 : 0.5)) }}
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold mr-1">{m.year}:</span>
                    {m.title}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Rechte Spalte: Road-SVG */}
          <div className="md:col-span-3 relative">
            <motion.svg
              viewBox="0 0 600 600"
              className="w-full h-[60vh] md:h-[70vh]"
              role="img"
              aria-label="Zeitstrahl der Meilensteine"
            >
              {/* Diagonale/geschwungene Road */}
              <defs>
                <linearGradient id="roadG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 40 540 C 180 440, 220 360, 300 320 C 420 260, 460 200, 560 120"
                fill="none"
                stroke="url(#roadG)"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength={1}
                initial={prefersReduced ? false : { pathLength: 1 }}
                style={prefersReduced
                  ? { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 0, opacity: 1 }
                  : { pathLength: 1, strokeDasharray: 1, strokeDashoffset: dashOffset, opacity: pathOpacity }}
              />

              {/* Milestone-Nodes */}
              {[
                { cx: 120, cy: 480 },
                { cx: 250, cy: 380 },
                { cx: 360, cy: 300 },
                { cx: 520, cy: 160 },
              ].map((p, i) => (
                <motion.circle
                  key={`node-${i}`}
                  cx={p.cx}
                  cy={p.cy}
                  r={8}
                  fill="#0ea5e9"
                  style={{ opacity: prefersReduced ? 1 : useTransform(activeIndex, (x) => (x >= i ? 1 : 0.3)) }}
                />
              ))}
            </motion.svg>

            {/* Content Cards passend zu Milestones (cross-fade) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {milestones.map((m, i) => (
                <motion.div
                  key={`card-${m.id}`}
                  className="min-w-[260px] max-w-sm rounded-xl border border-white/10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md shadow-lg p-4"
                  style={{ opacity: prefersReduced ? (i === 0 ? 1 : 0) : useTransform(activeIndex, (x) => (Math.round(x) === i ? 1 : 0)) }}
                  >
                  <div className="text-xs uppercase tracking-wide text-indigo-500 mb-1">{m.year}</div>
                  <div className="text-sm text-gray-800 dark:text-gray-100">{m.title}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default function Roadmap() {
  return (
    <section id="Roadmap" className="print-section snap-start h-[180vh] md:h-[220vh] relative px-0" role="region" aria-labelledby="roadmap-title">
      <ClientOnly>
        <RoadmapContent />
      </ClientOnly>
    </section>
  );
}

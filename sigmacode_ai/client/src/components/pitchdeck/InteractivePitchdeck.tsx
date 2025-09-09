/**
 * Demo/Example Component: InteractivePitchdeck
 *
 * Hinweis:
 * - Diese Datei dient ausschließlich als interaktive Demo/Spielwiese und wird in der Produktion nicht verwendet.
 * - Sie wird in der knip.config.json explizit ignoriert, um False Positives bei ungenutzten Dateien/Exports zu vermeiden.
 * - Produktionsrelevante PitchDeck-Sections werden ausschließlich über `routes/Marketing/PitchDeck.tsx`
 *   und den Barrel `components/pitchdeck/Sections/index.ts` gerendert.
 */
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

export default function InteractivePitchdeck() {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll" role="presentation" aria-label="Interaktives Pitchdeck Demo">
      {/* Cover */}
      <Section id="cover">
        <motion.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-6xl font-bold text-center"
        >
          SigmaCode AI Robotics
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.2 }}
          className="text-xl mt-4"
        >
          Revolutionizing Human-Robot Collaboration
        </motion.p>
      </Section>

      {/* Problem */}
      <Section id="problem">
        <AnimatedStat 
          value={7.6} 
          unit="M" 
          description="Fachkräftemangel in EU bis 2030" 
        />
      </Section>
    </div>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  return (
    <section 
      id={id} 
      className="snap-start h-screen w-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100"
      role="region"
      aria-labelledby={`${id}-heading`}
    >
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 50 }}
        whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={prefersReduced ? undefined : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full"
      >
        {children}
      </motion.div>
    </section>
  );
}

function AnimatedStat({ value, unit, description }: { value: number; unit: string; description: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="text-center" role="group" aria-label="Kennzahl">
      <motion.div
        initial={prefersReduced ? false : { scale: 0.98, opacity: 0 }}
        whileInView={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        className="text-8xl font-bold text-indigo-600"
        aria-live="polite"
      >
        {value}<span className="text-4xl">{unit}</span>
      </motion.div>
      <motion.p
        initial={prefersReduced ? false : { opacity: 0 }}
        whileInView={prefersReduced ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={prefersReduced ? undefined : { delay: 0.2 }}
        className="text-xl mt-4 text-gray-700"
      >
        {description}
      </motion.p>
    </div>
  );
}

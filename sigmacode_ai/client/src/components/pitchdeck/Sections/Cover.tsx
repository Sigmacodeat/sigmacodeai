import { motion, useTransform, MotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';
import { fadeIn } from '../Shared/variants';

export type CoverProps = {
  scrollYProgress: MotionValue<number>;
};

export default function Cover({ scrollYProgress }: CoverProps) {
  // Reduced motion respektieren
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Mehrere Parallax-Geschwindigkeiten
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  return (
    <section id="Cover" className="print-section snap-start h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Subtiler Robot-Parallax-Hintergrund */}
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="opacity-80" opacity={0.06} />
      </ClientOnly>
      {/* Parallax Dekor: Layer 1 (schneller) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-blue-500/20 to-indigo-400/10 blur-3xl will-change-transform"
        style={{ y: reduceMotion ? 0 : yFast }}
      />
      {/* Parallax Dekor: Layer 2 (langsamer) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-sky-400/10 to-blue-600/10 blur-3xl will-change-transform"
        style={{ y: reduceMotion ? 0 : ySlow }}
      />
      {/* Subtile Grid-Overlay (statisch, sehr schwach) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,_#1e293b_1px,_transparent_1px)] [background-size:24px_24px]" />

      <motion.h1
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-blue-600 mb-4 relative will-change-transform"
        style={reduceMotion ? undefined : { y: titleY, scale: titleScale }}
      >
        SigmaCode AI
      </motion.h1>
      <p className="text-2xl relative">Humanoide Roboter as a Service – KI für Alltag & Pflege</p>
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">„Roboter, die den Alltag erleichtern“</p>
    </section>
  );
}

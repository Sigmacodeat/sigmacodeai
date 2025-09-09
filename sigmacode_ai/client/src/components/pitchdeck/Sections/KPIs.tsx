import { motion } from 'framer-motion';
import { containerVar, SectionTitle } from './_shared';
import AnimatedCounter from '../Shared/AnimatedCounter';
import ProgressRing from '../Shared/ProgressRing';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';

export default function KPIs() {
  return (
    <section id="KPIs" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800 relative">
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="max-h-[120vh]" opacity={0.05} />
      </ClientOnly>
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>KPIs & Ziele</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="text-center flex flex-col items-center">
            <p className="text-sm text-gray-500">Roboter im Feld (2027)</p>
            <div className="mt-2 flex items-center gap-3">
              <ProgressRing value={85} aria-label="Roboter im Feld Fortschritt" />
              <AnimatedCounter to={120} className="text-4xl font-bold text-indigo-600" />
            </div>
          </div>
          <div className="text-center flex flex-col items-center">
            <p className="text-sm text-gray-500">ARPU/Monat</p>
            <div className="mt-2 flex items-center gap-3">
              <ProgressRing value={60} aria-label="ARPU Fortschritt" />
              <AnimatedCounter to={1800} suffix=" €" className="text-4xl font-bold text-indigo-600" />
            </div>
          </div>
          <div className="text-center flex flex-col items-center">
            <p className="text-sm text-gray-500">Bruttomarge</p>
            <div className="mt-2 flex items-center gap-3">
              <ProgressRing value={62} aria-label="Bruttomarge Fortschritt" />
              <AnimatedCounter to={62} suffix=" %" className="text-4xl font-bold text-indigo-600" />
            </div>
          </div>
          <div className="text-center flex flex-col items-center">
            <p className="text-sm text-gray-500">MRR (2027)</p>
            <div className="mt-2 flex items-center gap-3">
              <ProgressRing value={70} aria-label="MRR Fortschritt" />
              <AnimatedCounter to={95} suffix="0k €" className="text-4xl font-bold text-indigo-600" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

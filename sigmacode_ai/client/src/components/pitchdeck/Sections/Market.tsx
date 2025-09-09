import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import AnimatedCounter from '../Shared/AnimatedCounter';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';

export default function Market() {
  return (
    <section id="Markt" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 relative">
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="max-h-[120vh]" opacity={0.05} />
      </ClientOnly>
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Markt & Größe</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>SAM: Haushalte, Pflegeeinrichtungen, Hotels in EU</motion.li>
          <motion.li variants={itemVar}>Wachstum: +20% CAGR soziale/Service-Robotik</motion.li>
          <motion.li variants={itemVar}>Einstiegsmärkte: AT/DE Pflege & Hospitality</motion.li>
        </ul>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <AnimatedCounter to={150} suffix=" Mrd €" className="text-3xl font-extrabold text-indigo-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">TAM (global)</p>
          </div>
          <div className="text-center">
            <AnimatedCounter to={28} suffix=" Mrd €" className="text-3xl font-extrabold text-indigo-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">SAM (EU)</p>
          </div>
          <div className="text-center">
            <AnimatedCounter to={2} suffix=" Mrd €" className="text-3xl font-extrabold text-indigo-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">SOM (Startregion)</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

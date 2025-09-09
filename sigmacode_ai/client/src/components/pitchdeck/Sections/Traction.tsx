import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';

export default function Traction() {
  return (
    <section id="Traction" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800 relative">
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="max-h-[120vh]" opacity={0.05} />
      </ClientOnly>
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Traction & Validierung</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>LoIs/Interessenbekundungen (Pflege, Hospitality)</motion.li>
          <motion.li variants={itemVar}>Technik-Demos/Prototypen, Feldtests geplant</motion.li>
          <motion.li variants={itemVar}>Advisory/Partnerschaften in Aufbau</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

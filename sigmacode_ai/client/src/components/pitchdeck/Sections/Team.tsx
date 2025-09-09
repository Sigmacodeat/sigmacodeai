import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';

export default function Team() {
  return (
    <section id="Team" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800 relative">
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="max-h-[120vh]" opacity={0.06} />
      </ClientOnly>
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Team & Rollen</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>KI/Robotik, Produkt, Partnerschaften, Regulierung</motion.li>
          <motion.li variants={itemVar}>Advisors: Pflege, HRI, Sicherheit</motion.li>
          <motion.li variants={itemVar}>Hiring-Plan: Core-Engineering, Field Ops</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

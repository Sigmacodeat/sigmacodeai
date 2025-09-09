import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';

export default function Impact() {
  return (
    <section id="Impact" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 relative">
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="max-h-[120vh]" opacity={0.06} />
      </ClientOnly>
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Impact</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>Wirtschaftlich: Wertschöpfung & neue High-Tech-Jobs in Österreich</motion.li>
          <motion.li variants={itemVar}>Gesellschaftlich: Entlastung Pflege, Selbstständigkeit für Senioren</motion.li>
          <motion.li variants={itemVar}>Ökologisch: RaaS = Kreislauf, effizientere Ressourcennutzung</motion.li>
          <motion.li variants={itemVar}>Wissenschaftlich: Europäischer Beitrag zu KI & Robotik</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';

export default function Technology() {
  return (
    <section id="Technik" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 relative">
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="max-h-[120vh]" opacity={0.06} />
      </ClientOnly>
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Technisches Konzept</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>KI-Kern: Sprachmodell + Entscheidungs-Engine</motion.li>
          <motion.li variants={itemVar}>Sensorik: Kamera, LiDAR, Audio → multimodal</motion.li>
          <motion.li variants={itemVar}>Skill-Store: Cloud-basiert, jederzeit erweiterbar</motion.li>
          <motion.li variants={itemVar}>Hardware: Integration auf bestehende humanoide Plattformen (Tesla, Unitree, Neura)</motion.li>
          <motion.li variants={itemVar}>TRL 4 → 7 (Simulation → Prototyp → Pilotkunde)</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

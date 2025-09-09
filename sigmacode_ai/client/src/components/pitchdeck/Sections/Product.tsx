import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';

export default function Product() {
  return (
    <section id="Produkt" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" opacity={0.05} />
      </ClientOnly>
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Produkt & USP</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Produkt</h3>
            <ul className="list-disc pl-6 space-y-1">
              <motion.li variants={itemVar}>KI-OS für humanoide Roboter mit Skill-Store</motion.li>
              <motion.li variants={itemVar}>Multimodale Wahrnehmung (Vision, Sprache, Sensorik)</motion.li>
              <motion.li variants={itemVar}>Edge + Cloud Hybrid, kontinuierliches Lernen</motion.li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-600">USP</h3>
            <ul className="list-disc pl-6 space-y-1">
              <motion.li variants={itemVar}>Alltagstauglichkeit & Sicherheit by Design</motion.li>
              <motion.li variants={itemVar}>Leistbares RaaS mit modularen Skills</motion.li>
              <motion.li variants={itemVar}>Schnelle Integration auf gängige Hardware</motion.li>
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

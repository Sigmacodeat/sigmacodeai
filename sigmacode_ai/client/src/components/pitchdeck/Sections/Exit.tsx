import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';

export default function Exit() {
  return (
    <section id="Exit" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Exit-Strategie</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>IPO: 2030+</motion.li>
          <motion.li variants={itemVar}>Potenzielle Käufer: Robotics/Cloud Player</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

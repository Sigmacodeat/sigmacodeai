import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';

export default function Risks() {
  return (
    <section id="Risiken" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Risiken & Mitigation</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>Hardware-Abhängigkeit → Multi-Vendor-Strategie</motion.li>
          <motion.li variants={itemVar}>Sicherheit/Haftung → Safety-Layer, Zulassungen</motion.li>
          <motion.li variants={itemVar}>Akzeptanz → UX-Design, Piloten, kontinuierliches Feedback</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

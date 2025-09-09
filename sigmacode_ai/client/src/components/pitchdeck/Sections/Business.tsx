import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';

export default function Business() {
  return (
    <section id="Business" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Geschäftsmodell (RaaS)</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>Abo-Modell: 1.500–2.500 €/Monat pro Roboter</motion.li>
          <motion.li variants={itemVar}>Inklusive: Wartung, Updates, Support</motion.li>
          <motion.li variants={itemVar}>Pay-per-Skill: Zusatzmodule buchbar</motion.li>
          <motion.li variants={itemVar}>Kundensegmente: Haushalte, Pflegeeinrichtungen, Hotels, KMU</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';

export default function Competition() {
  return (
    <section id="Wettbewerb" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Wettbewerb</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>Heute: Digit, Unitree, Optimus, Pepper – teuer/limitiert</motion.li>
          <motion.li variants={itemVar}>Unsere Differenzierung: Alltag, Preis, EU-Fokus, Skills</motion.li>
          <motion.li variants={itemVar}>Partnerschaften statt Eigen-Hardware</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

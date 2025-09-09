import { motion } from 'framer-motion';
import { containerVar, SectionTitle } from './_shared';

export default function Contact() {
  return (
    <section id="Kontakt" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Kontakt</SectionTitle>
        <p className="text-lg text-gray-700 dark:text-gray-300">Kontaktieren Sie uns für Demos, Piloten und Partnerschaften.</p>
        <ul className="mt-4">
          <li className="text-blue-600">hello@sigmacode.ai</li>
        </ul>
      </motion.div>
    </section>
  );
}

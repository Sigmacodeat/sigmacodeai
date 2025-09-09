import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';

export default function GTM() {
  return (
    <section id="GTM" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Go-To-Market</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>Pilotkunden in Pflege & Hotels, Referenzen aufbauen</motion.li>
          <motion.li variants={itemVar}>Direktvertrieb + Partner (Systemintegratoren)</motion.li>
          <motion.li variants={itemVar}>Pricing/Packaging-Experimente, Skill-Bundles</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

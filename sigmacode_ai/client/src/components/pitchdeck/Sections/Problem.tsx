import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import AnimatedCounter from '../Shared/AnimatedCounter';

export default function Problem() {
  return (
    <section id="Problem" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Problem & Marktbedarf</SectionTitle>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <motion.li variants={itemVar}>Demografischer Wandel: 30 % der EU-Bevölkerung 65+ bis 2050</motion.li>
          <motion.li variants={itemVar}>Pflege- & Dienstleistungsmangel → steigender Fachkräftemangel</motion.li>
          <motion.li variants={itemVar}>Bisherige Roboterlösungen: teuer, nur für Großkunden, nicht alltagstauglich</motion.li>
        </ul>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <AnimatedCounter to={7600000} suffix="+" className="text-4xl font-extrabold text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Fachkräftemangel EU bis 2030</p>
          </div>
          <div className="text-center">
            <AnimatedCounter to={30} suffix=" %" className="text-4xl font-extrabold text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Bevölkerung 65+ bis 2050</p>
          </div>
          <div className="text-center">
            <AnimatedCounter to={45} suffix="k €" className="text-4xl font-extrabold text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Kosten/Jahr pro Lagerkraft</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

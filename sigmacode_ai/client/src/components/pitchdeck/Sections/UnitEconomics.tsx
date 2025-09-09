import { motion } from 'framer-motion';
import { containerVar, SectionTitle } from './_shared';
import AnimatedCounter from '../Shared/AnimatedCounter';

export default function UnitEconomics() {
  return (
    <section id="UnitEconomics" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Unit Economics</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900 text-center">
            <p className="text-sm text-gray-500">CAC (Pilotgewinnung)</p>
            <AnimatedCounter to={5} suffix=" k€" className="text-4xl font-bold text-blue-600" />
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900 text-center">
            <p className="text-sm text-gray-500">LTV (36 Monate)</p>
            <AnimatedCounter to={54} suffix=" k€" className="text-4xl font-bold text-blue-600" />
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900 text-center">
            <p className="text-sm text-gray-500">LTV:CAC</p>
            <AnimatedCounter to={10} suffix=":" className="text-4xl font-bold text-blue-600" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Annahmen: Churn &lt; 5%/Monat, Bruttomarge &gt; 60% ab Jahr 3.</p>
      </motion.div>
    </section>
  );
}

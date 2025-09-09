import { motion } from 'framer-motion';
import { containerVar, SectionTitle } from './_shared';

export default function Ask() {
  return (
    <section id="Ask" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Funding Request</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-500">aws Preseed</p>
            <p className="text-xl font-semibold">€330k</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Team + Prototype</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-500">FFG Basis</p>
            <p className="text-xl font-semibold">€1.5M</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">R&D Scaling</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-500">Private</p>
            <p className="text-xl font-semibold">€2M</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Market Entry</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

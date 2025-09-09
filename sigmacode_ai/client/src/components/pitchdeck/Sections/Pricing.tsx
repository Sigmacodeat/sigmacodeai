import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import { CheckCircle } from 'lucide-react';

export default function Pricing() {
  const plans = [
    { name: 'Starter', price: '€1.500/Monat', features: ['1 Roboter', 'Basis-Skills', 'Remote Support'] },
    { name: 'Pro', price: '€2.200/Monat', features: ['1–2 Roboter', 'Erweiterte Skills', 'Onsite + Remote'] },
    { name: 'Enterprise', price: 'ab €2.500/Monat', features: ['3+ Roboter', 'Custom Skills', 'SLA & Integrationen'] },
  ];
  return (
    <section id="Pricing" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Pricing & Packaging</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <motion.div key={p.name} variants={itemVar} className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900 shadow-sm">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="text-2xl text-blue-600 mt-2">{p.price}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle className="text-blue-500" /> {f}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Add-ons: Pay-per-Skill, Integrationspakete, Premium-Support.</p>
      </motion.div>
    </section>
  );
}

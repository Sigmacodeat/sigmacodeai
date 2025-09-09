import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section id="CTA" className="print-section snap-start h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-50 dark:bg-gray-800">
      <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
        <h2 className="text-3xl font-bold mb-4">Nächster Schritt</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Wir suchen Partner für Piloten, Co-Development und Finanzierung.</p>
        <a href="#Kontakt" className="inline-block rounded-md bg-blue-600 text-white px-5 py-3 hover:bg-blue-700">Jetzt Kontakt aufnehmen</a>
      </motion.div>
    </section>
  );
}

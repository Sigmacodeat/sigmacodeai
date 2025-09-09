import { motion } from 'framer-motion';
import { containerVar, itemVar, SectionTitle } from './_shared';
import ClientOnly from '../Shared/ClientOnly';
import ParallaxRobot from '../Shared/ParallaxRobot';
import { CheckCircle } from 'lucide-react';

export default function Solution() {
  return (
    <section id="Lösung" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 relative">
      <ClientOnly>
        <ParallaxRobot src="/pitchdeck/robots/robot-1.svg" className="max-h-[120vh]" opacity={0.06} />
      </ClientOnly>
      <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <SectionTitle>Unsere Lösung</SectionTitle>
        <ul className="space-y-3 text-lg">
          <motion.li variants={itemVar} className="flex items-center gap-2"><CheckCircle className="text-blue-500"/> KI-Betriebssystem für humanoide Roboter</motion.li>
          <motion.li variants={itemVar} className="flex items-center gap-2"><CheckCircle className="text-blue-500"/> Skill-Store (App-Store für Roboterfähigkeiten)</motion.li>
          <motion.li variants={itemVar} className="flex items-center gap-2"><CheckCircle className="text-blue-500"/> Robot-as-a-Service Modell</motion.li>
          <motion.li variants={itemVar} className="flex items-center gap-2"><CheckCircle className="text-blue-500"/> Use Cases: Pflege, Haushalt, Hotellerie, Logistik</motion.li>
        </ul>
      </motion.div>
    </section>
  );
}

import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <section className="py-12">
      <h1 className="text-2xl font-bold">Kontakt & Support</h1>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Wir helfen dir gerne weiter. Wähle einen Kanal:
      </p>
      <ul className="mt-4 list-inside list-disc text-sm text-gray-700 dark:text-gray-300">
        <li>E-Mail: support@sigmacode.ai</li>
        <li>Community: <Link className="underline" to="/support/community">Diskussionsforum</Link></li>
        <li>Status: <Link className="underline" to="/support/status">Systemstatus</Link></li>
        <li>Tickets: <Link className="underline" to="/support/tickets">Ticket erstellen</Link></li>
      </ul>
    </section>
  );
}

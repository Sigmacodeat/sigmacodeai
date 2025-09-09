import { Link } from 'react-router-dom';

export default function Tickets() {
  return (
    <section className="py-12">
      <h1 className="text-2xl font-bold">Support-Tickets</h1>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Erstelle ein neues Ticket oder sieh dir deine bestehenden Anfragen an.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          to="#new"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Neues Ticket erstellen
        </Link>
        <Link
          to="#my-tickets"
          className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Meine Tickets anzeigen
        </Link>
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <p>
          Hinweis: Dies ist eine Platzhalter-Seite. Binde hier später deine Ticket-API oder dein
          Helpdesk-System ein.
        </p>
      </div>
    </section>
  );
}

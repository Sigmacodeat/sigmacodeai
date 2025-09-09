import { Link } from 'react-router-dom';
import SupportLayout from './SupportLayout';

const cards = [
  { to: '/support/faq', title: 'FAQ', desc: 'Häufige Fragen schnell beantwortet.' },
  { to: '/support/knowledge', title: 'Wissensdatenbank', desc: 'Guides, Best Practices, How-Tos.' },
  { to: '/support/status', title: 'Status', desc: 'Aktueller Systemstatus & Historie.' },
  { to: '/support/contact', title: 'Kontakt', desc: 'Support kontaktieren – sicher & schnell.' },
  { to: '/support/tickets', title: 'Tickets', desc: 'Eigene Support-Tickets einsehen.' },
  { to: '/support/community', title: 'Community', desc: 'Austausch mit anderen Nutzer:innen.' },
  { to: '/support/changelog', title: 'Changelog', desc: 'Produkt-Updates & Änderungen.' },
];

export default function SupportOverview() {
  return (
    <SupportLayout>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-lg border p-4 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring">
            <h3 className="text-lg font-medium group-hover:underline">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </section>
    </SupportLayout>
  );
}

import { NavLink, Outlet } from 'react-router-dom';
import { PropsWithChildren } from 'react';

const tabs = [
  { to: '/support', label: 'Übersicht', end: true },
  { to: '/support/faq', label: 'FAQ' },
  { to: '/support/knowledge', label: 'Wissensdatenbank' },
  { to: '/support/status', label: 'Status' },
  { to: '/support/contact', label: 'Kontakt' },
  { to: '/support/tickets', label: 'Tickets' },
  { to: '/support/community', label: 'Community' },
  { to: '/support/changelog', label: 'Changelog' },
];

export default function SupportLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Support</h1>
        <p className="mt-2 text-muted-foreground">
          Hilfe, Status, Dokumentation und Kontakt. Alles an einem Ort.
        </p>
        <nav className="mt-6 border-b">
          <ul className="flex flex-wrap gap-4">
            {tabs.map((t) => (
              <li key={t.to}>
                <NavLink
                  to={t.to}
                  end={t.end as any}
                  className={({ isActive }) =>
                    `inline-block border-b-2 px-2 py-2 text-sm transition-colors ${
                      isActive ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  {t.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>{children ?? <Outlet />}</main>
    </div>
  );
}

import SupportLayout from './SupportLayout';

const faqs: { q: string; a: string }[] = [
  { q: 'Wie starte ich ein neues Gespräch?', a: 'Öffnen Sie \'Chat\' und klicken Sie auf \'+ Neu\'. Wählen Sie Ihr Modell und starten Sie die Unterhaltung.' },
  { q: 'Wie verbinde ich eine API?', a: 'Unter Einstellungen > Integrationen können Sie Provider verbinden. Folgen Sie dem Assistenten.' },
  { q: 'Wie melde ich ein Problem?', a: 'Erstellen Sie ein Ticket unter Support > Tickets oder nutzen Sie das Kontaktformular.' },
];

export default function SupportFAQ() {
  return (
    <SupportLayout>
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">Häufige Fragen</h2>
        <div className="divide-y rounded-lg border">
          {faqs.map((f, i) => (
            <details key={i} className="group p-4">
              <summary className="cursor-pointer list-none text-lg font-medium outline-none transition hover:text-foreground">
                {f.q}
              </summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </SupportLayout>
  );
}

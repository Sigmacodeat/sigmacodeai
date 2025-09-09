import SupportLayout from './SupportLayout';

export default function Status() {
  return (
    <SupportLayout>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Systemstatus</h1>
        <p className="text-muted-foreground">
          Aktueller Betriebszustand der Dienste. Ausführliche Inhalte können hier später ergänzt werden.
        </p>
      </section>
    </SupportLayout>
  );
}

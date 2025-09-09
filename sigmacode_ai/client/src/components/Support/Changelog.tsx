import SupportLayout from './SupportLayout';

export default function Changelog() {
  return (
    <SupportLayout>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Changelog</h1>
        <p className="text-muted-foreground">
          Produkt-Updates und Änderungen. Release-Notes werden hier angezeigt.
        </p>
      </section>
    </SupportLayout>
  );
}

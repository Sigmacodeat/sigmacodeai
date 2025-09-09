import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, Bot, Plug2, ShieldCheck, Gauge, Network } from 'lucide-react';
import { z } from 'zod';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import Card from '../../components/Landing/components/Card';
import SEO from '../../components/marketing/SEO';

export default function PricingDetails() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const faqLd = [
    { q: 'Unterstützt ihr BYOK?', a: 'Ja, du kannst eigene API-Keys verwenden (BYOK).' },
    { q: 'Gibt es Limits?', a: 'Limits hängen vom gewählten Plan und Sicherheitsrichtlinien ab.' },
    { q: 'Rabatte?', a: 'Jährliche Abrechnung erhält typischerweise ~20% Rabatt.' },
  ];
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <SEO
        title="Pricing – BYOK oder Managed"
        description="Preismodelle für SIGMACODE AI: Bring‑Your‑Own‑Key (BYOK) oder Managed mit SLA. Rechner zur Kostenschätzung inklusive."
        canonical="/pricing"
        robots="index,follow"
        openGraph={{
          title: 'Pricing – Flexible Optionen',
          description: 'Kosten transparent kalkulieren: Eigene API (BYOK) oder Managed mit SLA, Monitoring und Governance.',
          url: origin ? `${origin}/pricing` : undefined,
          type: 'website',
          siteName: 'SIGMACODE AI',
        }}
        twitter={{
          card: 'summary',
          title: 'SIGMACODE AI – Pricing',
          description: 'BYOK vs. Managed, Limits, SLAs und ein Kostenkalkulator für deine Planung.',
        }}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqLd.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <Hero />
        <TokenBasics />
        <BYOKvsManaged />
        <ProviderSamples />
        <LimitsAndRates />
        <SLAInfo />
        <CalculatorSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="py-10">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Flexible Preise – Eigene API oder Managed</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Nutze unseren Managed-Stack oder bringe deine eigene API mit. Der Kalkulator hilft dir, die monatlichen Kosten grob zu schätzen.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#calculator" className="inline-flex items-center rounded-md bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400/70 dark:focus-visible:ring-teal-500/70"><Calculator className="mr-2 h-4 w-4" /> Zum Kalkulator</a>
            <Link to="/c/new" aria-label="AI Chat öffnen" className="inline-flex items-center rounded-md px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"><Bot className="mr-2 h-4 w-4" /> Jetzt starten</Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="relative h-64">
            <div className="grid h-full place-items-center text-center text-sm text-gray-600 dark:text-gray-300">
              <div>
                <Plug2 className="mx-auto h-8 w-8 text-brand-primary" />
                <p className="mt-2">Eigene API bring-your-own-key (BYOK) oder Managed – du entscheidest.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function TokenBasics() {
  const items = [
    { title: 'Tokens', desc: 'Modelle rechnen in Tokens (Stücke von Text). Prompt + Antwort = Gesamttokens.' },
    { title: 'Kostenprinzip', desc: 'Preis basiert meist auf 1k Tokens. Gesamtkosten ≈ Tokens/1000 × Preis.' },
    { title: 'Kontext', desc: 'Lange Kontexte, Dateien (RAG) und Tools erhöhen die Tokenmenge.' },
  ];
  return (
    <section id="token" className="py-12 scroll-mt-24">
      <h2 className="text-xl font-semibold">Token‑Grundlagen</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title} className="text-sm">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-gray-600 dark:text-gray-300">{it.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function BYOKvsManaged() {
  const cols = [
    {
      title: 'BYOK (Bring‑Your‑Own‑Key)',
      points: [
        'Volle Provider‑Wahl & direkte Abrechnung beim Modellanbieter',
        'Hohe Flexibilität bei Preisen & Regionen',
        'Schlüsselverwaltung in deiner Domäne',
      ],
    },
    {
      title: 'Managed',
      points: [
        'Schneller Start, zentrale Abrechnung & Support',
        'SLA‑Optionen, Monitoring & Governance inklusive',
        'Weniger operativer Aufwand',
      ],
    },
  ];
  return (
    <section id="byok" className="py-12 scroll-mt-24">
      <h2 className="text-xl font-semibold">BYOK vs. Managed</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {cols.map((c) => (
          <Card key={c.title}>
            <h3 className="font-semibold">{c.title}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
              {c.points.map((p) => (<li key={p}>{p}</li>))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ProviderSamples() {
  const providers = ['OpenAI', 'Anthropic', 'Mistral', 'Groq', 'DeepSeek', 'Google Vertex/Gemini', 'Azure OpenAI', 'AWS Bedrock'];
  return (
    <section id="providers" className="py-12 scroll-mt-24">
      <h2 className="text-xl font-semibold">Provider‑Beispiele</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Preise variieren je Anbieter/Modell. Nutze unseren Kalkulator für Näherungen und prüfe die offiziellen Anbieterpreise.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {providers.map((p) => (
          <span key={p} className="rounded-md bg-white px-3 py-1.5 text-sm dark:bg-gray-900">{p}</span>
        ))}
      </div>
    </section>
  );
}

function LimitsAndRates() {
  const items = [
    { icon: Gauge, title: 'Rate Limits', desc: 'Provider begrenzen Requests/Tokens pro Zeit. Plane Puffer und Backoff ein.' },
    { icon: Network, title: 'Concurrency', desc: 'Parallele Anfragen steuern, Queues und Retries nutzen.' },
    { icon: ShieldCheck, title: 'Governance', desc: 'Max Tokens/Msg, Max Steps (Ketten), erlaubte Tools & Domains.' },
  ];
  return (
    <section id="limits" className="py-12 scroll-mt-24">
      <h2 className="text-xl font-semibold">Limits & Rate Limits</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title}>
            <div className="mb-2"><it.icon className="h-5 w-5 text-brand-primary" /></div>
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SLAInfo() {
  const items = [
    { title: 'Support & SLA', desc: 'Managed‑Pläne mit garantierten Reaktionszeiten & Eskalationspfaden.' },
    { title: 'Monitoring & Alerts', desc: 'Laufende Überwachung, Metriken und proaktive Benachrichtigungen.' },
    { title: 'Compliance', desc: 'DSGVO, Audit‑Logs, Datenhoheit. On‑Prem/Hybrid mit Enterprise möglich.' },
  ];
  return (
    <section id="sla" className="py-12 scroll-mt-24">
      <h2 className="text-xl font-semibold">SLA & Support</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title}>
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CalculatorSection() {
  const presets = [
    { id: 'mini', label: 'Kompakt (Mini) – Beispiel', tokensPerMsg: 600, pricePer1k: 0.15 },
    { id: 'std', label: 'Allround (Standard) – Beispiel', tokensPerMsg: 800, pricePer1k: 0.5 },
    { id: 'pro', label: 'Advanced (Pro) – Beispiel', tokensPerMsg: 1000, pricePer1k: 1.5 },
    { id: 'custom', label: 'Eigene Werte', tokensPerMsg: 800, pricePer1k: 0.5 },
  ] as const;

  const [preset, setPreset] = useState<typeof presets[number]['id']>('std');
  const [monthlyMessages, setMonthlyMessages] = useState<number>(50000);
  const [avgTokensPerMsg, setAvgTokensPerMsg] = useState<number>(800);
  const [pricePer1kTokens, setPricePer1kTokens] = useState<number>(0.5); // EUR pro 1k Tokens
  const [overheadPct, setOverheadPct] = useState<number>(10); // Infrastruktur/Moderation etc.
  const [managedPct, setManagedPct] = useState<number>(15); // Optionaler Managed-Zuschlag

  const eurFmt = useMemo(() => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }), []);

  const schema = z.object({
    monthlyMessages: z.number().min(0, 'Muss ≥ 0 sein').max(10_000_000, 'Zu groß'),
    avgTokensPerMsg: z.number().min(0, 'Muss ≥ 0 sein').max(32_000, 'Max 32k'),
    pricePer1kTokens: z.number().min(0, 'Muss ≥ 0 sein').max(100, 'Unrealistisch hoch'),
    overheadPct: z.number().min(0, 'Muss ≥ 0% sein').max(100, 'Max 100%'),
    managedPct: z.number().min(0, 'Muss ≥ 0% sein').max(100, 'Max 100%'),
  });

  // Debounce Inputs for validation and calculation
  const dMonthlyMessages = useDebouncedValue(monthlyMessages, 300);
  const dAvgTokensPerMsg = useDebouncedValue(avgTokensPerMsg, 300);
  const dPricePer1kTokens = useDebouncedValue(pricePer1kTokens, 300);
  const dOverheadPct = useDebouncedValue(overheadPct, 300);
  const dManagedPct = useDebouncedValue(managedPct, 300);

  const errors = useMemo(() => {
    const res = schema.safeParse({ monthlyMessages: dMonthlyMessages, avgTokensPerMsg: dAvgTokensPerMsg, pricePer1kTokens: dPricePer1kTokens, overheadPct: dOverheadPct, managedPct: dManagedPct });
    if (res.success) return {} as Record<string, string>;
    const out: Record<string, string> = {};
    for (const issue of res.error.issues) {
      const key = issue.path.join('.') || 'form';
      out[key] = issue.message;
    }
    return out;
  }, [dMonthlyMessages, dAvgTokensPerMsg, dPricePer1kTokens, dOverheadPct, dManagedPct]);

  const ownApiCost = useMemo(() => {
    const totalTokens = (dMonthlyMessages * dAvgTokensPerMsg) / 1000; // in kTokens
    const base = totalTokens * dPricePer1kTokens; // EUR
    const overhead = base * (dOverheadPct / 100);
    return base + overhead;
  }, [dMonthlyMessages, dAvgTokensPerMsg, dPricePer1kTokens, dOverheadPct]);

  const managedCost = useMemo(() => {
    const totalTokens = (dMonthlyMessages * dAvgTokensPerMsg) / 1000; // in kTokens
    const base = totalTokens * dPricePer1kTokens; // EUR
    const overhead = base * (dOverheadPct / 100);
    const surcharge = base * (dManagedPct / 100);
    return base + overhead + surcharge;
  }, [dMonthlyMessages, dAvgTokensPerMsg, dPricePer1kTokens, dOverheadPct, dManagedPct]);

  return (
    <section id="calculator" className="py-12 scroll-mt-24">
      <h2 className="text-xl font-semibold">API-Kostenkalkulator (Schätzung)</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Gibt eine Näherung, keine verbindliche Preisangabe.</p>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" role="group" aria-labelledby="calc-title">
        <Card className="md:col-span-3">
          <label className="block text-sm font-medium" htmlFor="preset">Modell-Preset</label>
          <select
            id="preset"
            className="mt-2 w-full rounded-md bg-white p-2 text-sm dark:bg-gray-950"
            value={preset}
            onChange={(e) => {
              const id = e.target.value as typeof presets[number]['id'];
              setPreset(id);
              const p = presets.find(pr => pr.id === id)!;
              if (id !== 'custom') {
                setAvgTokensPerMsg(p.tokensPerMsg);
                setPricePer1kTokens(p.pricePer1k);
              }
            }}
            aria-describedby="preset-help"
          >
            {presets.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <p id="preset-help" className="mt-2 text-xs text-gray-500">Beispielwerte – bitte Preise deines Anbieters prüfen.</p>
        </Card>
        <Card>
          <label className="block text-sm font-medium" htmlFor="msgs">Nachrichten/Monat</label>
          <input
            id="msgs"
            type="number"
            className="mt-2 w-full rounded-md bg-white p-2 text-sm dark:bg-gray-950"
            value={monthlyMessages}
            onChange={(e) => setMonthlyMessages(Number(e.target.value || 0))}
            min={0}
            aria-invalid={Boolean(errors['monthlyMessages'])}
            aria-describedby={errors['monthlyMessages'] ? 'msgs-error' : undefined}
          />
          {errors['monthlyMessages'] && (
            <p id="msgs-error" role="alert" className="mt-1 text-xs text-red-600">{errors['monthlyMessages']}</p>
          )}
        </Card>
        <Card>
          <label className="block text-sm font-medium" htmlFor="tpm">Ø Tokens je Nachricht</label>
          <input
            id="tpm"
            type="number"
            className="mt-2 w-full rounded-md bg-white p-2 text-sm dark:bg-gray-950"
            value={avgTokensPerMsg}
            onChange={(e) => setAvgTokensPerMsg(Number(e.target.value || 0))}
            min={0}
            aria-invalid={Boolean(errors['avgTokensPerMsg'])}
            aria-describedby={errors['avgTokensPerMsg'] ? 'tpm-error' : undefined}
          />
          {errors['avgTokensPerMsg'] && (
            <p id="tpm-error" role="alert" className="mt-1 text-xs text-red-600">{errors['avgTokensPerMsg']}</p>
          )}
        </Card>
        <Card>
          <label className="block text-sm font-medium" htmlFor="p1k">Preis je 1k Tokens (EUR)</label>
          <input
            id="p1k"
            type="number"
            step="0.01"
            className="mt-2 w-full rounded-md bg-white p-2 text-sm dark:bg-gray-950"
            value={pricePer1kTokens}
            onChange={(e) => setPricePer1kTokens(Number(e.target.value || 0))}
            min={0}
            aria-invalid={Boolean(errors['pricePer1kTokens'])}
            aria-describedby={errors['pricePer1kTokens'] ? 'p1k-error' : undefined}
          />
          {errors['pricePer1kTokens'] && (
            <p id="p1k-error" role="alert" className="mt-1 text-xs text-red-600">{errors['pricePer1kTokens']}</p>
          )}
        </Card>
        <Card className="md:col-span-3">
          <label className="block text-sm font-medium" htmlFor="oh">Overhead (%)</label>
          <input
            id="oh"
            type="number"
            step="1"
            className="mt-2 w-full rounded-md bg-white p-2 text-sm dark:bg-gray-950"
            value={overheadPct}
            onChange={(e) => setOverheadPct(Number(e.target.value || 0))}
            min={0}
            aria-invalid={Boolean(errors['overheadPct'])}
            aria-describedby={errors['overheadPct'] ? 'oh-error' : undefined}
          />
          {errors['overheadPct'] && (
            <p id="oh-error" role="alert" className="mt-1 text-xs text-red-600">{errors['overheadPct']}</p>
          )}
        </Card>
        <Card className="md:col-span-3">
          <label className="block text-sm font-medium" htmlFor="mgd">Managed‑Zuschlag (%)</label>
          <input
            id="mgd"
            type="number"
            step="1"
            className="mt-2 w-full rounded-md bg-white p-2 text-sm dark:bg-gray-950"
            value={managedPct}
            onChange={(e) => setManagedPct(Number(e.target.value || 0))}
            min={0}
            aria-invalid={Boolean(errors['managedPct'])}
            aria-describedby={errors['managedPct'] ? 'mgd-error' : undefined}
          />
          {errors['managedPct'] && (
            <p id="mgd-error" role="alert" className="mt-1 text-xs text-red-600">{errors['managedPct']}</p>
          )}
        </Card>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Schätzung: Eigene API</h3>
          <p className="mt-2 text-3xl font-extrabold">{eurFmt.format(isFinite(ownApiCost) ? ownApiCost : 0)} <span className="text-base font-medium text-gray-500">/ Monat</span></p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">inkl. Overhead von {overheadPct}%</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Schätzung: Managed (mit Zuschlag)</h3>
          <p className="mt-2 text-3xl font-extrabold">{eurFmt.format(isFinite(managedCost) ? managedCost : 0)} <span className="text-base font-medium text-gray-500">/ Monat</span></p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">inkl. Overhead {overheadPct}%, Managed‑Zuschlag {managedPct}%</p>
          <div className="mt-5 text-xs text-gray-500 dark:text-gray-400">Hinweis: Zuschlag als Näherung, reale Preise je nach Plan/Volumen.</div>
          <div className="mt-5">
            <Link to="/" className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800">Zur Landingpage</Link>
          </div>
        </Card>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-12 scroll-mt-24">
      <h2 className="text-xl font-semibold">FAQ zur Preisgestaltung</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { q: 'Unterstützt ihr BYOK?', a: 'Ja, du kannst eigene API-Keys verwenden (BYOK).' },
          { q: 'Gibt es Limits?', a: 'Limits hängen vom gewählten Plan und Sicherheitsrichtlinien ab.' },
          { q: 'Rabatte?', a: 'Jährliche Abrechnung erhält typischerweise ~20% Rabatt.' },
        ].map((f) => (
          <Card key={f.q} className="text-sm">
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1.5 text-gray-600 dark:text-gray-300">{f.a}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 text-sm text-gray-600 dark:text-gray-400">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <span>© {new Date().getFullYear()} SIGMACODE AI</span>
        <div className="flex items-center gap-4">
          <Link className="hover:underline" to="/">Landing</Link>
          <Link className="hover:underline" to="/ai-agents">AI Agents</Link>
        </div>
      </div>
    </footer>
  );
}

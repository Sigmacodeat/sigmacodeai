import { z } from 'zod';

// Zod Schema for integration content
export const IntegrationSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  faqs: z
    .array(
      z.object({
        q: z.string(),
        a: z.string(),
      }),
    )
    .default([]),
  cta: z
    .object({
      label: z.string().default('Get Started'),
      href: z.string().default('/c/new'),
    })
    .default({ label: 'Get Started', href: '/c/new' }),
  // optional marketing fields
  logo: z.string().optional(),
  ogImage: z.string().optional(),
});

export type Integration = z.infer<typeof IntegrationSchema>;

// Demo data (can be replaced with MDX/JSON files later)
const rawIntegrations: Integration[] = [
  {
    slug: 'slack',
    title: 'Slack Integration',
    category: 'Communication',
    description:
      'Verbinde deine Agenten mit Slack, um Nachrichten zu senden, Benachrichtigungen zu erhalten und Workflows direkt im Channel zu triggern.',
    features: [
      'Senden/Empfangen von Nachrichten',
      'Slash Commands für Agent-Aktionen',
      'Granulare Scopes & Audit Logs',
    ],
    steps: [
      'Slack App erstellen und Tokens generieren',
      'Scopes konfigurieren (chat:write, channels:read, etc.)',
      'In SigmacodeAI Projekt die Slack-Credentials hinterlegen',
    ],
    faqs: [
      { q: 'Unterstützt ihr Threads?', a: 'Ja, Agenten können in Threads antworten und Kontext bewahren.' },
      { q: 'Wie werden Tokens gesichert?', a: 'Über verschlüsselte Secrets und rollenbasierte Zugriffe (RBAC).' },
    ],
    cta: { label: 'Mit Slack verbinden', href: '/c/new' },
    logo: '/assets/integrations/slack.svg',
  },
  {
    slug: 'notion',
    title: 'Notion Integration',
    category: 'Knowledge',
    description:
      'Binde Notion-Seiten und Datenbanken an, damit Agenten Inhalte lesen, referenzieren und automatisch aktualisieren können.',
    features: [
      'Datenbank-Abfragen',
      'Seiten lesen & erstellen',
      'Feingranulare Berechtigungen',
    ],
    steps: [
      'Notion Internal Integration erstellen',
      'Datenbanken/Seiten mit der Integration teilen',
      'Integration in SigmacodeAI hinzufügen und testen',
    ],
    faqs: [
      { q: 'Unterstützt ihr Relations/Rollups?', a: 'Ja, häufige Properties werden abgebildet und validiert.' },
    ],
    cta: { label: 'Notion verbinden', href: '/c/new' },
    logo: '/assets/integrations/notion.svg',
  },
];

export const integrations = rawIntegrations
  .map((i) => IntegrationSchema.parse(i))
  .sort((a, b) => a.title.localeCompare(b.title));

export const getIntegrationBySlug = (slug: string) =>
  integrations.find((i) => i.slug === slug);

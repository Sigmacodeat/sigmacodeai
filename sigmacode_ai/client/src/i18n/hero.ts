// Lightweight i18n for HeroSection (DE/EN) without external deps
// Extend locales as needed; integrate with a global i18n later.

export type Locale = 'de' | 'en';

export type HeroCopy = {
  h1: string;
  /**
   * Brand-Teil des Titels (soll alleine im <h1> stehen)
   */
  h1Brand: string;
  /**
   * Deskriptive Tagline (separates Element, z. B. <h2> oder <p>)
   */
  h1Tagline: string;
  subcopy: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaAgents: string;
  ctaPricing: string;
  ctaNoteSrOnly?: string;
  trustbarLabel: string;
  /**
   * Optionale Begrüßungs-/Demo-Nachrichten für die animierte Message-Bubble
   * im Hero. Wenn leer/undefined, wird die Animation übersprungen.
   */
  messages?: string[];
  /**
   * Kurzer Signature-Badge-Text, der erklärt, was SIGMACODE AI ist.
   */
  badgeSignature?: string;
};

const copy: Record<Locale, HeroCopy> = {
  de: {
    h1: 'SIGMACODE AI — Enterprise‑Plattform für Chat & Agenten',
    h1Brand: 'SIGMACODE AI',
    h1Tagline: 'GenAI‑Plattform für Enterprise‑Chat & Agenten',
    subcopy:
      'RAG‑Assistenten mit Policies & RBAC. Integrationen für SQL, Notion, Confluence. On‑prem/Cloud, DSGVO‑konform – vom PoC bis Produktion.',
    ctaPrimary: 'AI Chat starten',
    ctaSecondary: 'Mehr erfahren',
    ctaAgents: 'Agenten entdecken',
    ctaPricing: 'Preise & Kalkulator',
    ctaNoteSrOnly: 'Kein Account nötig',
    trustbarLabel: 'Vertraut von Teams weltweit',
    messages: [
      'Willkommen – ich orchestriere Chat, Agenten, Tools & Wissensbasen für dich.',
    ],
    badgeSignature: 'Enterprise GenAI‑Plattform für Chat & Agenten',
  },
  en: {
    h1: 'SIGMACODE AI — Enterprise platform for chat & agents',
    h1Brand: 'SIGMACODE AI',
    h1Tagline: 'GenAI platform for enterprise chat & agents',
    subcopy:
      'RAG assistants with policies & RBAC. Integrations for SQL, Notion, Confluence. On‑prem/cloud, GDPR‑ready — from PoC to production.',
    ctaPrimary: 'Start AI Chat',
    ctaSecondary: 'Learn more',
    ctaAgents: 'Explore Agents',
    ctaPricing: 'Pricing & Calculator',
    ctaNoteSrOnly: 'No account required',
    trustbarLabel: 'Trusted by teams worldwide',
    messages: [
      'Welcome — I orchestrate chat, agents, tools & knowledge for you.',
    ],
    badgeSignature: 'Enterprise GenAI platform for chat & agents',
  },
};

export function getHeroCopy(locale: Locale = 'de'): HeroCopy {
  return copy[locale] ?? copy.de;
}

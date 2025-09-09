import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SEO from '~/components/marketing/SEO';
import SectionHeader from '~/components/marketing/SectionHeader';
import { Link } from 'react-router-dom';
import { Palette, Component, Sparkles, ArrowRight } from 'lucide-react';
import { buttonStyles, buttonSizeXs } from '~/components/ui/Button';

export default function DesignDemo() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <SEO
        title={`${tt('marketing.design_demo.meta.title', { defaultValue: 'Design Demo' })} · SIGMACODE AI`}
        description={tt('marketing.design_demo.meta.description', { defaultValue: 'Erkunde unser UI-Designsystem, Komponenten und Interaktionsmuster.' })}
        canonical="/design-demo"
        keywords={[
          tt('marketing.design_demo.kw.components', { defaultValue: 'Komponenten' }),
          tt('marketing.design_demo.kw.tokens', { defaultValue: 'Design Tokens' }),
          tt('marketing.design_demo.kw.motion', { defaultValue: 'Motion' }),
        ]}
        robots="index,follow"
        openGraph={{
          title: tt('marketing.design_demo.meta.title', { defaultValue: 'Design Demo' }),
          description: tt('marketing.design_demo.meta.description', { defaultValue: 'Erkunde unser UI-Designsystem, Komponenten und Interaktionsmuster.' }),
          type: 'website',
          siteName: 'SIGMACODE AI',
        }}
        twitter={{
          card: 'summary_large_image',
          title: tt('marketing.design_demo.meta.title', { defaultValue: 'Design Demo' }),
          description: tt('marketing.design_demo.meta.description', { defaultValue: 'Erkunde unser UI-Designsystem, Komponenten und Interaktionsmuster.' }),
        }}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: tt('marketing.design_demo.meta.title', { defaultValue: 'Design Demo' }), item: '/design-demo' },
            ],
          },
        ]}
      />

      <main className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <Hero />
        <Tokens />
        <ComponentsGallery />
        <CTA />
      </main>
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  return (
    <section className="py-10 md:py-16" aria-labelledby="design-hero-title">
      <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 md:grid-cols-2">
        <div>
          <h1 id="design-hero-title" className="text-[2rem] leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            {tt('marketing.design_demo.hero.title', { defaultValue: 'Designsystem & Komponenten' })}
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-gray-700 dark:text-gray-300">
            {tt('marketing.design_demo.hero.subtitle', { defaultValue: 'Konsistente, zugängliche UI-Bausteine – optimiert für Geschwindigkeit, Barrierefreiheit und Dark-Mode.' })}
          </p>

          <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
            <Link to="/c/new" className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}>
              <span className="inline-flex items-center">
                {tt('marketing.design_demo.hero.cta_primary', { defaultValue: 'Jetzt ausprobieren' })}
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
            <Link to="/pricing" className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}>
              {tt('marketing.design_demo.hero.cta_secondary', { defaultValue: 'Preise ansehen' })}
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative h-72 sm:h-80 overflow-hidden p-5 sm:p-6"
          aria-hidden="true"
        >
          {[{ pos: 'right-6 top-6', icon: Palette, text: tt('marketing.design_demo.hero.colors', { defaultValue: 'Farben & Themes' }), color: 'text-brand-primary', delay: 0 },
            { pos: 'left-6 top-6', icon: Component, text: tt('marketing.design_demo.hero.components', { defaultValue: 'UI-Komponenten' }), color: 'text-brand-accent', delay: 0.2 },
            { pos: 'bottom-8 right-8', icon: Sparkles, text: tt('marketing.design_demo.hero.motion', { defaultValue: 'Motion & Micro-UX' }), color: 'text-brand-primary', delay: 0.4 },
          ].map((el) => (
            <motion.div
              key={el.text as string}
              className={`absolute ${el.pos} ui-glass-card px-3 py-2 text-xs sm:text-sm`}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3 + (el.delay as number) }}
            >
              <span className="inline-flex items-center gap-2">
                <el.icon className={`h-4 w-4 ${el.color}`} /> {el.text}
              </span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Tokens() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const items = [
    { title: tt('marketing.design_demo.tokens.color.title', { defaultValue: 'Farben' }), desc: tt('marketing.design_demo.tokens.color.desc', { defaultValue: 'Semantische Farben für Light/Dark, Akzente und Zustände.' }) },
    { title: tt('marketing.design_demo.tokens.spacing.title', { defaultValue: 'Spacing' }), desc: tt('marketing.design_demo.tokens.spacing.desc', { defaultValue: 'Einheitliche Abstände und Layout-Gitter.' }) },
    { title: tt('marketing.design_demo.tokens.typography.title', { defaultValue: 'Typografie' }), desc: tt('marketing.design_demo.tokens.typography.desc', { defaultValue: 'Skalierbare Textgrößen, Lesbarkeit und Kontraste.' }) },
  ];
  return (
    <section id="tokens" className="py-14 md:py-20" aria-labelledby="tokens-title">
      <SectionHeader
        icon={Palette}
        badgeText={tt('marketing.design_demo.tokens.badge', { defaultValue: 'Design Tokens' })}
        badgeVariant="glass"
        title={tt('marketing.design_demo.tokens.title', { defaultValue: 'Design Tokens' })}
        id="tokens-title"
        as="h2"
        subtitle={tt('marketing.design_demo.tokens.subtitle', { defaultValue: 'Grundbausteine für ein konsistentes, skalierbares UI.' })}
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComponentsGallery() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const cards = [
    { title: tt('marketing.design_demo.components.buttons.title', { defaultValue: 'Buttons' }), desc: tt('marketing.design_demo.components.buttons.desc', { defaultValue: 'Primär, Sekundär, Danger, Ghost – inkl. Fokus-Ringe.' }) },
    { title: tt('marketing.design_demo.components.cards.title', { defaultValue: 'Cards' }), desc: tt('marketing.design_demo.components.cards.desc', { defaultValue: 'Glass, Hover, Shadow – mit reduzierter visueller Last.' }) },
    { title: tt('marketing.design_demo.components.forms.title', { defaultValue: 'Formulare' }), desc: tt('marketing.design_demo.components.forms.desc', { defaultValue: 'Kontrollierte Inputs, Fehlermeldungen, Barrierefreiheit.' }) },
  ];
  return (
    <section id="components" className="py-14 md:py-20" aria-labelledby="components-title">
      <SectionHeader
        icon={Component}
        badgeText={tt('marketing.design_demo.components.badge', { defaultValue: 'Komponenten' })}
        badgeVariant="outline"
        title={tt('marketing.design_demo.components.title', { defaultValue: 'Komponenten' })}
        id="components-title"
        as="h2"
        subtitle={tt('marketing.design_demo.components.subtitle', { defaultValue: 'Bewährte UI-Bausteine mit sauberer Typisierung.' })}
      />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="ui-glass-card ui-glass-card-hover p-6 shadow-sm transition-shadow hover:shadow">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  return (
    <section className="py-14 md:py-20" aria-labelledby="design-cta-title">
      <div className="mb-12 h-px bg-gradient-to-r from-brand-primary/0 via-brand-primary/40 to-brand-accent/0" aria-hidden="true" />
      <SectionHeader
        icon={Sparkles}
        badgeText={tt('marketing.design_demo.cta.badge', { defaultValue: 'Demo' })}
        badgeVariant="glass"
        badgeTone="teal"
        title={tt('marketing.design_demo.cta.title', { defaultValue: 'Bereit für das Beste aus UX und Performance?' })}
        id="design-cta-title"
        as="h2"
        subtitle={tt('marketing.design_demo.cta.subtitle', { defaultValue: 'Starte jetzt mit SIGMACODE AI oder erkunde die Preisgestaltung.' })}
      />
      <div className="rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent px-6 py-12 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            {tt('marketing.design_demo.cta.title', { defaultValue: 'Bereit für das Beste aus UX und Performance?' })}
          </h3>
          <p className="mt-2 text-base md:text-lg opacity-90">
            {tt('marketing.design_demo.cta.subtitle', { defaultValue: 'Starte jetzt mit SIGMACODE AI oder erkunde die Preisgestaltung.' })}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/c/new" aria-label={tt('marketing.design_demo.cta.primary_aria', { defaultValue: 'Neuen Chat starten' })} className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}>
            {tt('marketing.design_demo.cta.primary', { defaultValue: 'Jetzt starten' })}
          </Link>
          <Link to="/pricing#calculator" className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}>
            {tt('marketing.design_demo.cta.secondary_pricing', { defaultValue: 'Preisrechner öffnen' })}
          </Link>
        </div>
      </div>
    </section>
  );
}

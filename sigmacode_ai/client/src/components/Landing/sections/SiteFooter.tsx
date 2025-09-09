import ThemeToggle from '../../common/ThemeToggle';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { marketingConfig } from '../../../config/marketing';

export default function SiteFooter() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const year = new Date().getFullYear();
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<null | 'success' | 'error'>(null);

  const nav = {
    product: [
      { label: tt('marketing.landing.footer.product.features', { defaultValue: 'Features' }), href: '#features' },
      { label: tt('marketing.landing.footer.product.integrations', { defaultValue: 'Integrationen' }), href: '#integrations' },
      { label: tt('marketing.landing.footer.product.use_cases', { defaultValue: 'Use Cases' }), href: '#use-cases' },
      { label: tt('marketing.landing.footer.product.security', { defaultValue: 'Sicherheit' }), href: '#security' },
    ],
    company: [
      { label: tt('marketing.landing.footer.company.about', { defaultValue: 'Über uns' }), href: '/about' },
      { label: tt('marketing.landing.footer.company.contact', { defaultValue: 'Kontakt' }), href: '/contact' },
      { label: tt('marketing.landing.footer.company.blog', { defaultValue: 'Blog' }), href: '/blog' },
      { label: tt('marketing.landing.footer.company.careers', { defaultValue: 'Karriere' }), href: '/careers' },
    ],
    resources: [
      { label: tt('marketing.landing.footer.resources.pricing_overview', { defaultValue: 'Preisübersicht' }), href: '#pricing' },
      { label: tt('marketing.landing.footer.resources.docs', { defaultValue: 'Docs' }), href: '/docs' },
      { label: tt('marketing.landing.footer.resources.status', { defaultValue: 'Status' }), href: '/status' },
      { label: tt('marketing.landing.footer.resources.changelog', { defaultValue: 'Changelog' }), href: '/changelog' },
    ],
    legal: [
      { label: tt('marketing.landing.footer.legal.imprint', { defaultValue: 'Impressum' }), href: '/imprint' },
      { label: tt('marketing.landing.footer.legal.privacy', { defaultValue: 'Datenschutz' }), href: '/privacy' },
      { label: tt('marketing.landing.footer.legal.terms', { defaultValue: 'AGB' }), href: '/terms' },
      { label: tt('marketing.landing.footer.legal.dpa', { defaultValue: 'DPA' }), href: '/dpa' },
    ],
  } as const;

  return (
    <footer role="contentinfo" className="border-t border-app bg-transparent text-sm text-gray-600 dark:bg-transparent dark:text-gray-400">
      {/* Top: Newsletter & Brand */}
      <div className="mx-auto max-w-[1050px] px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              SIGMACODE AI
            </div>
            <p className="max-w-sm text-gray-600 dark:text-gray-400">
              {tt('marketing.landing.footer.brand_tagline', { defaultValue: 'Moderne AI-Plattform für Teams und Unternehmen. Sicher, erweiterbar und produktionsreif.' })}
            </p>
            <div className="flex items-center gap-3" aria-labelledby="footer-social-heading">
              <h3 id="footer-social-heading" className="sr-only">
                {tt('marketing.landing.footer.social.heading', { defaultValue: 'Soziale Kanäle' })}
              </h3>
              <a
                href={marketingConfig.githubUrl}
                aria-label={tt('marketing.landing.footer.social.github', { defaultValue: 'GitHub' })}
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="footer-social-github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={marketingConfig.twitterUrl}
                aria-label={tt('marketing.landing.footer.social.twitter', { defaultValue: 'Twitter / X' })}
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="footer-social-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={marketingConfig.linkedinUrl}
                aria-label={tt('marketing.landing.footer.social.linkedin', { defaultValue: 'LinkedIn' })}
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="footer-social-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${marketingConfig.contactEmail}`}
                aria-label={tt('marketing.landing.footer.social.email', { defaultValue: 'E-Mail' })}
                className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                data-analytics-id="footer-social-email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <div className="rounded-lg border border-app bg-surface p-4 backdrop-blur-sm shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <h3 className="mb-1 typo-section-title text-gray-900 dark:text-gray-100">
                {tt('marketing.landing.footer.newsletter.title', { defaultValue: 'Bleib auf dem Laufenden' })}
              </h3>
              <p id="newsletter-desc" className="mb-3 typo-section-subtitle text-gray-500 dark:text-gray-400">
                {tt('marketing.landing.footer.newsletter.subtitle', { defaultValue: 'Produkt-Updates, Best Practices und exklusive Einblicke. Kein Spam.' })}
              </p>
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setNewsletterStatus(null);
                  setNewsletterLoading(true);
                  try {
                    const form = e.currentTarget as HTMLFormElement & { email?: { value?: string }, consent?: { checked?: boolean } };
                    const email = (form.email?.value || '').trim();
                    const consent = !!form.consent?.checked;
                    if (!email || !consent) {
                      throw new Error('invalid');
                    }
                    // Mock-Request: Hier später echten Provider anbinden
                    await new Promise((res) => setTimeout(res, 600));
                    setNewsletterStatus('success');
                    form.reset();
                  } catch {
                    setNewsletterStatus('error');
                  } finally {
                    setNewsletterLoading(false);
                  }
                }}
              >
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    {tt('marketing.landing.footer.newsletter.label', { defaultValue: 'E-Mail-Adresse' })}
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    enterKeyHint="send"
                    aria-describedby="newsletter-desc newsletter-status"
                    placeholder={tt('marketing.landing.footer.newsletter.placeholder', { defaultValue: 'Deine E-Mail-Adresse' })}
                    className="w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none ring-0 transition hover:border-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-100 dark:placeholder-gray-500 dark:hover:border-white/20 dark:focus:border-white/25 dark:focus:ring-white/10"
                  />
                </div>
                {/* Consent Checkbox */}
                <div className="flex items-start gap-2">
                  <input id="newsletter-consent" name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-200 dark:border-white/15 dark:bg-gray-900/40 dark:text-white dark:focus:ring-white/10" />
                  <label htmlFor="newsletter-consent" className="text-xs text-gray-600 dark:text-gray-400">
                    {tt('marketing.landing.footer.newsletter.consent', { defaultValue: 'Ich stimme der Verarbeitung meiner Daten gemäß der ' })}
                    <a href="/privacy" className="underline hover:text-gray-900 dark:hover:text-gray-200">{tt('marketing.landing.footer.newsletter.privacy', { defaultValue: 'Datenschutzerklärung' })}</a>
                  </label>
                </div>
                {/* Honeypot */}
                <div aria-hidden="true" className="hidden">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60 dark:border-white/10 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                  disabled={newsletterLoading}
                >
                  {newsletterLoading ? tt('marketing.landing.footer.newsletter.loading', { defaultValue: 'Wird gesendet…' }) : tt('marketing.landing.footer.newsletter.cta', { defaultValue: 'Abonnieren' })}
                </button>
                {/* Live region for async status */}
                <span id="newsletter-status" aria-live="polite" className="sr-only">
                  {newsletterStatus === 'success' && tt('marketing.landing.footer.newsletter.success', { defaultValue: 'Erfolgreich abonniert.' })}
                  {newsletterStatus === 'error' && tt('marketing.landing.footer.newsletter.error', { defaultValue: 'Leider fehlgeschlagen. Bitte erneut versuchen.' })}
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Link-Gruppen */}
      <div className="mx-auto max-w-[1050px] px-4 sm:px-6 pb-10">
        <nav aria-labelledby="footer-groups-heading">
          <h2 id="footer-groups-heading" className="sr-only">{tt('marketing.landing.footer.groups.title', { defaultValue: 'Footer-Navigation' })}</h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
          <div>
            <h4 id="footer-group-product" className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {tt('marketing.landing.footer.groups.product', { defaultValue: 'Produkt' })}
            </h4>
            <ul className="space-y-2" aria-labelledby="footer-group-product">
              {nav.product.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    href={link.href === '#integrations' ? '#integrations-heading' : link.href}
                    aria-controls={link.href === '#integrations' ? 'integrations-heading' : undefined}
                    data-analytics-id="footer-nav-product"
                    data-link-label={link.label}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 id="footer-group-company" className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {tt('marketing.landing.footer.groups.company', { defaultValue: 'Unternehmen' })}
            </h4>
            <ul className="space-y-2" aria-labelledby="footer-group-company">
              {nav.company.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    href={link.href}
                    data-analytics-id="footer-nav-company"
                    data-link-label={link.label}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 id="footer-group-resources" className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {tt('marketing.landing.footer.groups.resources', { defaultValue: 'Ressourcen' })}
            </h4>
            <ul className="space-y-2" aria-labelledby="footer-group-resources">
              {nav.resources.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    href={link.href}
                    data-analytics-id="footer-nav-resources"
                    data-link-label={link.label}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 id="footer-group-legal" className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {tt('marketing.landing.footer.groups.legal', { defaultValue: 'Rechtliches' })}
            </h4>
            <ul className="space-y-2" aria-labelledby="footer-group-legal">
              {nav.legal.map((link) => (
                <li key={link.label}>
                  <a
                    className="text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    href={link.href}
                    data-analytics-id="footer-nav-legal"
                    data-link-label={link.label}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-app">
        <div className="mx-auto flex max-w-[1050px] flex-col items-center justify-between gap-4 px-4 sm:px-6 py-6 sm:flex-row">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {tt('marketing.landing.footer.copyright', { defaultValue: '© {{year}} SIGMACODE AI. Alle Rechte vorbehalten.', year })}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#faq"
              className="text-xs text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              aria-controls="faq-heading"
              data-analytics-id="footer-bottom-faq"
            >
              {tt('marketing.landing.footer.bottom.faq', { defaultValue: 'FAQ' })}
            </a>
            <a
              href="#pricing"
              className="text-xs text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              aria-controls="pricing-heading"
              data-analytics-id="footer-bottom-pricing"
            >
              {tt('marketing.landing.footer.bottom.pricing', { defaultValue: 'Preise' })}
            </a>
            <span className="mx-2 h-4 w-px bg-gray-200 dark:bg-gray-800" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}


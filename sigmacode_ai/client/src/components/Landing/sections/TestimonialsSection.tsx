// Motion: Reveal/Stagger
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LandingSection from '../components/LandingSection';
import { Reveal } from '../../motion/Reveal';
import Stagger from '../../motion/Stagger';
import { trackEvent } from '../../../utils/analytics';

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;

  // Defaults (werden genutzt, wenn i18n keine strukturierten Items liefert)
  const defaultItems = [
    { text: tt('marketing.landing.testimonials.items.0', '„Seit SIGMACODE AI hat sich unsere Time-to-Resolution halbiert.“') },
    { text: tt('marketing.landing.testimonials.items.1', '„Wir konnten 30% Support-Tickets automatisieren – mit klaren Policies.“') },
    { text: tt('marketing.landing.testimonials.items.2', '„Multi-Provider brachte uns Kosten runter und Qualität rauf.“') },
  ];

  type Testimonial = { text: string; author?: string };
  const raw = t('marketing.landing.testimonials.items', { returnObjects: true, defaultValue: defaultItems }) as unknown;

  const items: Testimonial[] = Array.isArray(raw)
    ? raw.map((entry, i) => {
        if (typeof entry === 'string') {
          return { text: entry, author: tt(`marketing.landing.testimonials.authors.${i}`, '') || undefined };
        }
        if (entry && typeof entry === 'object') {
          const obj = entry as Record<string, unknown>;
          const text = typeof obj.text === 'string' ? obj.text : defaultItems[i]?.text ?? '';
          const authorFromObj = typeof obj.author === 'string' ? obj.author : undefined;
          const author = authorFromObj ?? (tt(`marketing.landing.testimonials.authors.${i}`, '') || undefined);
          return { text, author };
        }
        return { text: defaultItems[i]?.text ?? '' };
      })
    : defaultItems;
  return (
    <LandingSection id="testimonials" ariaLabelledby="testimonials-heading" className="-mt-px">
        <Reveal as="div" variant="rise" y={12}>
          <SectionHeader
            icon={Quote}
            badgeText={tt('marketing.landing.sections.badges.testimonials')}
            id="testimonials-heading"
            title={tt('marketing.landing.testimonials.title', 'Was Kunden sagen')}
          />
        </Reveal>
        <Stagger as="ul" role="list" aria-labelledby="testimonials-heading" className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" gap={90} startDelay={120}>
          {items.map((item, i) => {
            const { text, author } = item;
            return (
              <li key={`testimonial-${i}`}>
                <Reveal as="div" variant="rise" y={10}>
                  <Card
                    variant="subtle"
                    data-analytics-id="testimonial"
                    data-idx={i}
                    onClick={() =>
                      trackEvent('landing.testimonials.card.click', {
                        index: i,
                        author: author || undefined,
                      })
                    }
                  >
                    <figure>
                      <blockquote className="typo-card-body italic text-gray-700 dark:text-gray-300">{text}</blockquote>
                      {author ? (
                        <figcaption className="mt-2 typo-caption text-gray-500 dark:text-gray-400">{author}</figcaption>
                      ) : null}
                    </figure>
                  </Card>
                </Reveal>
              </li>
            );
          })}
        </Stagger>
    </LandingSection>
  );
}

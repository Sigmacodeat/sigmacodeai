# Landing UI Styleguide (Kurz)

Dieser Leitfaden beschreibt die zentralen UI-Bausteine und Tokens für die Landing-Sections.

## Card
- Varianten: `glass`, `outline`, `plain`
- Größen: `size="sm"` bevorzugt auf Landing
- Interaktion: `interactive` für Hover/Focus-States (Shadow/Translate)

Beispiele:
```tsx
<Card variant="glass" size="sm" interactive>…</Card>
<Card variant="outline" size="sm">…</Card>
```

Empfehlungen:
- Listen/Gitter-Items: `glass + interactive`
- Akkordeon/FAQ-Header mit Content: `outline` für klare Trennung

## Buttons
Quelle: `client/src/components/ui/Button.tsx`
- Varianten: `primary`, `secondary`, `ghost`
- XS-Sizing-Tokens (mobile-first): `buttonSizeXs.primary | .secondary | .ghost`

Beispiele:
```tsx
<Link className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}>Jetzt starten</Link>
<Link className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}>Mehr</Link>
<Link className={`${buttonStyles.ghost} ${buttonSizeXs.ghost}`}>Details</Link>
```

Hinweise:
- XS-Sizes auf Mobile aktiv, ab `sm` werden Standardgrößen automatisch wiederhergestellt.
- Kein manuelles Mischen abweichender Padding/Textgrößen, wenn Tokens verfügbar sind.

## Section-Seams
- Einheitlicher Übergang zwischen Abschnitten mittels `className="-mt-px"` am `LandingSection`, außer im Hero (dort kein Border/Seam):
```tsx
<LandingSection id="…" className="-mt-px">…</LandingSection>
```

## ARIA/Accessibility
- FAQ/Accordion: Buttons mit `aria-controls`, `aria-expanded`, region mit `role="region"` + `aria-labelledby`.
- Listen: `role="list"` wo semantisch sinnvoll.

## Konventionen
- Keine inlined schweren Card-Stile – stattdessen `variant/size/interactive` nutzen.
- CTA-Buttons immer über zentrale Tokens stylen.
- Icons in Cards kompakt halten (`h-5 w-5` bzw. Badge-Icons `h-4 w-4`).

## Referenzen (aktuell umgesetzt)
- FAQ: `outline + sm` mit Divider
- Testimonials: `glass + sm + interactive`
- How it works: `glass + sm + interactive`, Buttons mit XS-Sizing
- Final CTA (Integrationskarten): `glass + sm + interactive`, CTA mit XS-Sizing
- Providers: `outline + sm` im Akkordeon-Pattern, Actions mit XS-Sizing

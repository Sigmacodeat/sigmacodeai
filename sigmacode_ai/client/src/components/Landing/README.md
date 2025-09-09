# Landing Design System – Kurzleitfaden

Diese Datei beschreibt die vereinheitlichten Bausteine für die ersten drei Landing-Sections (Hero, Highlights, Teaser) und wie sie konsistent eingesetzt werden.

## Komponenten & Utilities

- **LandingSection (`components/Landing/components/LandingSection.tsx`)**
  - Wrapper für Sektionen (Padding, `scroll-mt`, optionale Top-Border)
  - Verwende semantische Borderfarbe via `.border-app` (Light/Dark sicher)

- **SectionHeader (`components/marketing/SectionHeader.tsx`)**
  - Standardisiert Titel/Untertitel
  - Defaults: `tracking-tight`, `text-balance`, `text-gray-900 dark:text-white` (Title) und `text-gray-700/90 dark:text-gray-300` (Subtitle)
  - Optionaler `SectionBadge` oberhalb des Titels

- **SectionBadge (`components/marketing/SectionBadge.tsx`)**
  - Nutzt `ui/Badge` mit einheitlichem **Focus-Ring** (`teal` Brand) und Glass/Outline-Varianten
  - Für dezente Akzente: `variant="outline"` + `tone` (`teal`, `indigo`, `amber`, ...)

- **Card (`components/Landing/components/Card.tsx`)**
  - Für Highlights-Karten `variant="glass"` verwenden
  - Intern gemappt auf `ui-glass-card ui-glass-card-hover` (einheitliche Glassmorphism-Optik)
  - `interactive` für leichte Hover-Elevation aktivieren

- **Buttons (`components/ui/Button.tsx`)**
  - Zentrale Utilities: `buttonStyles` + `buttonSizeXs`
  - Varianten: `primary`, `secondary`, `ghost`
  - Beispiel: `${buttonStyles.primary} ${buttonSizeXs.primary}`

## Einsatzrichtlinien

- **Hero-CTAs**: `buttonStyles.primary` (Hauptaktion), `buttonStyles.secondary` (Sekundäraktion), zusätzliche kleine Links mit `ghost`.
- **Teaser-CTAs**: immer zentrale Button-Utilities nutzen; keine Tone-spezifischen Ad-hoc-Gradients mehr.
- **Highlights-Karten**: `Card variant="glass" interactive` verwenden, Beschreibungen mit `text-gray-700/90 dark:text-gray-300`.
- **Borders & Surfaces**: statt harter Tailwind-Grautöne semantische Utilities (`.border-app`, `.ui-glass-card`) einsetzen.

## Dark Mode

- Text: Subtitle/Beschreibung `text-gray-700/90` (Light) und `dark:text-gray-300` (Dark).
- Icons in Highlights: leicht entschärftes Light-Gray `text-gray-600/90`, im Dark-Mode `text-gray-300`.
- Focus-Ring: übergreifend `teal` (Buttons & Badges) mit `focus-visible:ring-offset-0`.

## Benennung & Skalierung

- Titelgrößen und Spacing sind in Header/Sections vorgegeben; vermeide Inline-Abweichungen.
- Für neue Karten/Bereiche die bestehenden Utilities wiederverwenden statt lokale Klassen zu kopieren.

## Edge Cases

- Reduzierte Bewegungen (prefers-reduced-motion): Animationen sind gedrosselt/deaktiviert (Framer presets beachten).
- Sehr dunkle Hintergründe: Fokus-Ringe sind auf `teal` abgestimmt; bei Bedarf `ring-offset` projektspezifisch ergänzen.

## Troubleshooting & Linting

- **Tailwind Arbitrary Values (Escaping)**: Bei Klassen wie `ease-[cubic-bezier(...)]` müssen eckige Klammern escaped werden, z. B. `ease-\[cubic-bezier(0.175,0.885,0.32,1.275)\]`. Sonst erscheinen Build-/JIT-Warnungen. Beispiel-Fix in `components/Chat/Messages/Content/DialogImage.tsx` umgesetzt.
- **Fokus-Ring-Konsistenz**: Einheitlich `focus-visible:ring-2 focus-visible:ring-teal-500/60 focus-visible:ring-offset-0`. Prüfe Light/Dark visuell auf ausreichend Kontrast. Für spezielle Hintergründe ggf. `ring-offset` hinzufügen.

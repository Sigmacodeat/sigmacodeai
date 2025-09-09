# Motion System

Leichtgewichtiges, konsistentes und a11y‑freundliches Animationssystem ohne externe Libs (nur CSS + minimal JS).

## Bestandteile

- CSS Tokens: `src/styles/motion.tokens.css`
  - `--motion-dur-*`, `--motion-ease-*`, `--motion-rise-*`, `--motion-opacity-*`, `--motion-scale-*`
  - Respektiert `prefers-reduced-motion` ⇒ Dauer = `0ms`
- CSS Keyframes: `src/styles/motion.keyframes.css`
  - `fadeIn`, `riseIn`, `scaleIn`, `shimmer`
- Tailwind Config: `client/tailwind.config.cjs`
  - `theme.extend.keyframes` + `theme.extend.animation`
  - Utilities: `animate-fade-in`, `animate-rise-in`, `animate-scale-in`, `shimmer`
- Hook: `useInView.ts`
  - IntersectionObserver, `once`, Threshold, RPRM‑Respect
- Komponenten: `Reveal.tsx`, `Stagger.tsx`
  - `Reveal`: animiert einzelnes Element (variant, delay, duration, y)
  - `Stagger`: sequenziert Kinder mit Gap/StartDelay; erhält semantische Listenstruktur (<li>) und animiert deren Inhalt

## Verwendung

- Einzelnes Element:
```tsx
<Reveal as="div" variant="rise" delay={80}>
  <SectionHeader ... />
</Reveal>
```

- Liste/Grid (semantisch korrekt):
```tsx
<Stagger as="ul" gap={70} startDelay={100} className="grid ...">
  {items.map((it) => (
    <li key={it.id}>
      <Reveal variant="rise" y={12}>
        <Card ... />
      </Reveal>
    </li>
  ))}
</Stagger>
```

## Richtlinien

- Performance: nur `transform` + `opacity`, `will-change` sparsam verwenden
- CLS vermeiden: `Reveal` rendert initial stabil; Inhalt bleibt im Flow
- A11y: `prefers-reduced-motion` ⇒ sofort sichtbar, ohne Animation
- Tokens als Single Source of Truth; je Section feintunen über `delay`, `y`, `duration`

## Edge Cases

- Server‑Render: Hook no‑op bis Client (sicherheitsnetz in `useInView`)
- Wiederholtes Ein-/Austreten: `once=false` verwenden
- Verschachtelte `Reveal`: Delays additiv planen oder `Stagger` benutzen

## Tests (Empfehlung)

- `useInView`: RPRM, once=true/false, thresholds
- `Stagger`: Delaykette, Merge von inneren `Reveal`‑Delays, <li> Behandlung
- Snapshot der Sections mit reduzierter Motion

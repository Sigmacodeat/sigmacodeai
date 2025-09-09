import { Fragment, useMemo } from 'react';

// Simple particle trail that flies from bubble area toward the center (bot)
// Render only when visible = true. Particles use randomized angles/offsets but stable per render.

type Props = {
  visible: boolean;
};

export default function IngestParticles({ visible }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        // starting around a circle above the bot (bubble area)
        sx: (Math.random() - 0.5) * 80,
        sy: -80 + (Math.random() - 0.5) * 20,
        // slight curve into the bot
        tx: (Math.random() - 0.5) * 10,
        ty: -8 + (Math.random() - 0.5) * 10,
        delay: i * 0.05,
      })),
    []
  );

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden>
      {particles.map((p) => (
        <Fragment key={p.id}>
          <span
            className="absolute h-1 w-1 rounded-full bg-sky-400/70 shadow"
            style={{ transform: `translate(${p.tx}px, ${p.ty}px)`, opacity: 0.9 }}
          />
        </Fragment>
      ))}
    </div>
  );
}

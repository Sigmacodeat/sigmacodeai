// Leichte, GPU-schonende CSS-Animationen (keine Framer Motion)
import Brand from '../../common/Brand';

type BotCoreProps = {
  minimal?: boolean; // wenn true: kein gefüllter runder Hintergrund
  paused?: boolean; // pausiert alle Core-Animationen
};

export default function BotCore({ minimal = false, paused = false }: BotCoreProps) {
  // 1:1 wie Login-Agent-Icon: direkte Brand-Verwendung (nur Icon + Glow)
  // zusätzliche Halo-/Ring-Elemente entfernt, um visuelle Parität sicherzustellen
  // Hinweis: paused => instant, damit die Augen sofort im finalen Zustand sind
  const size = 56; // entspricht vorherigem Augen-SVG (56px)
  const strokeWidth = 1.6;
  return (
    <div className="relative grid place-items-center">
      <Brand
        onlyIcon
        glow={false}
        iconSize={size}
        strokeWidth={strokeWidth}
        iconDelay={0}
        iconDuration={0.7}
        eyesDuration={0.5}
        eyesDelay={0}
        textDelay={0}
        textDuration={0}
        instant={paused}
        hideEyeShine
        eyeRadius={1.0}
      />
    </div>
  );
}

// Lokale Keyframes
// Augen blenden von 0 -> 1 ein, Halo folgt danach
// Diese Styles sind inline referenziert; hier nur die Keyframes
// (werden von Vite zusammengeführt)
//
// Hinweis: Minimal invasiv, keine externen CSS-Dateien nötig
// Entfernt: lokale Keyframes, da Brand eigene Animationen mitbringt

// Statisches Orbit-Layer – ohne Framer Motion
import type { LucideIcon } from 'lucide-react';
import React from 'react';
 

type Props = {
  icons: LucideIcon[];
  radius: number;
  className?: string;
  phaseOffsetDeg?: number; // additional angle offset to stagger between orbits
  glowVariant?: 'strong' | 'medium' | 'soft'; // controls glow/blur intensity
  itemSize?: number; // px size for icon container (width/height)
  iconPx?: number; // px size for the icon itself
  // optional: allow icons to use a per-item radius within a band instead of a single fixed radius
  minRadius?: number;
  maxRadius?: number;
  // optional: draw subtle connection lines from center to each icon
  drawConnections?: boolean;
  // when true, use curved Bezier paths instead of straight lines
  drawConnectionsCurve?: boolean;
  // when true, disables bobbing/suction so icons stay exactly on the circle
  lockOnCircle?: boolean;
  // when false, hides static white orbit rings/accent (keeps only icon glows)
  showOrbitRings?: boolean;
  // --- Optional Animations/Controls (No-Op in static layer, for unified API compatibility) ---
  duration?: number;
  direction?: number;
  parallaxOffset?: { x: number; y: number };
  parallaxScale?: number;
  dashedAccent?: boolean;
  counterDashedAbove?: boolean;
  iconSpinAlternate?: boolean;
  iconSpinDuration?: number;
  iconSpinMode?: 'none' | 'sync' | 'alt';
  iconSpinRatio?: number;
  driftDeg?: number;
  driftDuration?: number;
  speedFactor?: number;
  rotate?: boolean;
  paused?: boolean;
};

export default function OrbitLayer({ icons, radius, className, phaseOffsetDeg = 0, glowVariant = 'medium', itemSize = 48, iconPx = 24, minRadius, maxRadius, drawConnections = false, drawConnectionsCurve = false, lockOnCircle = false, showOrbitRings = true, 
  // folgende Props werden aktuell nicht genutzt, bleiben jedoch für API-Kompatibilität erhalten
  duration, direction, parallaxOffset, parallaxScale, dashedAccent, counterDashedAbove, iconSpinAlternate, iconSpinDuration, iconSpinMode, iconSpinRatio, driftDeg, driftDuration, speedFactor, rotate, paused,
}: Props) {
  // CSS Animationen werden über Utility-Klassen und Variablen gesteuert

  // Keine temporären Intro-States nötig – Flow wird rein über CSS-Animationen gesteuert

  // Deaktiviere die Halo-Render-Funktion vollständig
  const renderHalo = (i: number) => null;

  // Keine Side-Effects: alles statisch

  // stable pseudo-random in [0,1) based on index + phaseOffsetDeg (keeps distribution consistent across renders)
  const rand01 = (n: number) => {
    const x = Math.sin(n * 12.9898 + phaseOffsetDeg * 0.104729) * 43758.5453;
    return x - Math.floor(x);
  };

  // Icon-Farben an Hero-Verlauf (teal/cyan) anlehnen
  const iconColorClass = glowVariant === 'strong'
    ? 'text-teal-400 dark:text-teal-300'
    : glowVariant === 'medium'
    ? 'text-teal-300 dark:text-teal-200'
    : 'text-teal-200 dark:text-teal-100';

  // Variant-abhängige Halo-/Glow-Parameter (re-aktiviert für helleren Hintergrund)
  // "soft" -> dezent, "medium" -> sichtbar, "strong" -> betont
  const haloAdd = 0; // kein zusätzlicher Durchmesser
  const haloBlur = 0; // kein Weichzeichner
  const haloOpacity = 0; // unsichtbar
  const haloWhiteOpacity = 0; // unsichtbar

  // Hinweis: Wir verwenden CSS-Klassen (.ams-tool-enter, .ams-icon-rotator) und Variablen,
  // damit Entry (Zentrum -> Radius) und individuelle Rotation pro Icon starten können.

  const animState = paused ? ('paused' as const) : ('running' as const);

  return (
    <div
      className="ams-force-motion pointer-events-none absolute"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: `calc(50% - ${radius}px)`,
        top: `calc(50% - ${radius}px)`,
      }}
      aria-hidden
    >
      {/* Animations entfernt – Layer bleibt statisch */}

      {/* static phase offset wrapper to stagger between orbits */}
      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${phaseOffsetDeg}deg)`,
        }}
      >
          {/* static wrapper */}
          <div
            className={`absolute inset-0 ${className ?? ''}`}
          >
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{ willChange: 'transform' }}
              >
                {/* connection lines layer (below icons) */}
                {drawConnections && icons.length > 0 && (
                  <svg className="absolute inset-0" viewBox="-50 -50 100 100" aria-hidden>
                    {icons.map((_, i) => {
                      const angle = (i / icons.length) * 360 + phaseOffsetDeg;
                      const rBand = (typeof minRadius === 'number' && typeof maxRadius === 'number' && maxRadius > minRadius)
                        ? (minRadius + rand01(i + 101) * (maxRadius - minRadius))
                        : radius;
                      // normalize to viewBox [-50,50]
                      const rad = (rBand / radius) * 50;
                      const a = (angle * Math.PI) / 180;
                      const x = rad * Math.cos(a);
                      const y = rad * Math.sin(a);
                      const dash = 5 + (i % 4) * 1.5;
                      const widthMin = 0.8;
                      const widthMax = 1.6;
                      const strokeCol = 'rgba(56, 189, 248, 0.5)';
                      const glowCol = 'rgba(56, 189, 248, 0.22)';
                      if (!drawConnectionsCurve) {
                        return (
                          <g key={`sv-${i}`}>
                            <line x1={0} y1={0} x2={x} y2={y} stroke={glowCol} strokeWidth={widthMax + 0.6} strokeLinecap="round" strokeDasharray={`${dash} ${dash * 2}`} />
                            <line x1={0} y1={0} x2={x} y2={y} stroke={strokeCol} strokeLinecap="round" strokeDasharray={`${dash} ${dash * 2}`} strokeWidth={widthMin} />
                            <circle cx={x} cy={y} r={1.6} fill="rgba(56,189,248,0.85)" />
                          </g>
                        );
                      }
                      // Curved connection: quadratic Bezier with slight perpendicular bend
                      const bend = 0.06 + rand01(i) * 0.04; // much lighter curvature
                      const nx = x / Math.hypot(x, y || 1);
                      const ny = y / Math.hypot(x, y || 1);
                      // perpendicular vector for control point
                      const px = -ny;
                      const py = nx;
                      const cx = (x * 0.5) + px * rad * bend;
                      const cy = (y * 0.5) + py * rad * bend;
                      const d = `M 0 0 Q ${cx} ${cy} ${x} ${y}`;
                      return (
                        <g key={`cv-${i}`}>
                          <path d={d} fill="none" stroke={glowCol} strokeWidth={widthMax + 0.7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${dash} ${dash * 2}`} />
                          <path d={d} fill="none" stroke={strokeCol} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${dash} ${dash * 2}`} />
                          <circle cx={x} cy={y} r={1.6} fill="rgba(56,189,248,0.85)" />
                        </g>
                      );
                    })}
                  </svg>
                )}
                {/* orbit rings & accents can be hidden to avoid white circles in background */}
                {showOrbitRings && (
                  <>
                    <div className="absolute inset-0 rounded-full ring-1 ring-white/40 shadow-[0_0_40px_-6px_rgba(56,189,248,0.14)] dark:ring-white/15" />
                    {glowVariant !== 'strong' && (
                      <>
                        {/* always render a subtle solid accent ring (no dashed orbit) */}
                        <div className="absolute inset-6 rounded-full ring-1 ring-white/20 dark:ring-white/15" />
                        {/* leicht intensiverer Verlauf für mehr Helligkeit */}
                        <div className={`absolute -inset-1 rounded-full bg-gradient-to-br from-teal-400/0 via-sky-300/5 to-cyan-300/12 ${'blur-[2px]'}`} />
                      </>
                    )}
                  </>
                )}
                {icons.map((I, i) => {
                  const angle = (i / Math.max(1, icons.length)) * 360 + phaseOffsetDeg;
                  // Radius: fester Radius oder Band
                  const rBand = (typeof minRadius === 'number' && typeof maxRadius === 'number' && maxRadius > minRadius)
                    ? (minRadius + rand01(i + 101) * (maxRadius - minRadius))
                    : radius;
                  // Timing: kompakter, sofort sichtbarer Start
                  const baseStart = 0.0; // s
                  const enterDur = 0.6; // s
                  const step = 0.2; // s
                  const enterDelay = baseStart + i * step;
                  const rotDelay = enterDelay + enterDur;
                  const rotDur = 6.0; // s volle Umdrehung

                  return (
                    <div
                      key={i}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ transform: 'translateZ(0)' }}
                    >
                      {/* Winkel-Wrapper richtet die Orbit-Achse aus */}
                      <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                        {/* Rotator startet nach Entry und läuft kontinuierlich */}
                        <div
                          className="ams-icon-rotator"
                          style={{
                            ['--icon-rot-delay' as any]: `${rotDelay}s`,
                            ['--icon-rot-fast-dur' as any]: `1.2s`,
                            ['--icon-rot-slow-dur' as any]: `16s`,
                            transformOrigin: 'center',
                            willChange: paused ? undefined : 'transform',
                            animationPlayState: animState,
                          }}
                        >
                          {/* Entry: von Zentrum (translateX(0)) auf Radius */}
                          <div
                            className="ams-orbit-item ams-tool-enter"
                            style={{
                              ['--orbit-r' as any]: `${rBand}px`,
                              ['--tool-enter-delay' as any]: `${enterDelay}s`,
                              ['--tool-enter-dur' as any]: `${enterDur}s`,
                              animationPlayState: animState,
                            }}
                          >
                            <div className="relative grid place-items-center" style={{ width: itemSize, height: itemSize }}>
                              {renderHalo(i)}
                              <I aria-hidden className={`${iconColorClass} drop-shadow-[0_0_6px_rgba(56,189,248,0.20)]`} style={{ width: iconPx, height: iconPx }} strokeWidth={1.55} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

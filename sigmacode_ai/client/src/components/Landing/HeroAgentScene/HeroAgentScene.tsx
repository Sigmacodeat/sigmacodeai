import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import UnifiedOrbit from '../shared/UnifiedOrbit';
import AgentAvatar from '../shared/AgentAvatar';

export type HeroAgentSceneProps = {
  // messages prop kept for backward-compatibility but not used anymore
  messages?: string[];
  // instant: pause all orbits/animations (reduced motion or skip-intro)
  instant?: boolean;
};

export default function HeroAgentScene({ messages = [], instant = false }: HeroAgentSceneProps) {
  // messages intentionally unused — scene focuses on premium icon orbits + bot core

  // Use unified icon set slices to keep consistency across sections
  const iconsA = UNIFIED_ICON_SET.slice(0, 6);
  const iconsB = UNIFIED_ICON_SET.slice(6, 11);
  const iconsC = UNIFIED_ICON_SET.slice(11, 15);
  // Statisch: keine Parallax-/Speed-/Paused-Logik mehr
  const [speedFactor] = useState<number>(1);
  // Orchestrierung & Sichtbarkeit: Orbits starten erst wenn user gescrollt hat UND inView (oder instant)
  // Measure container to keep orbits within viewport (column bounds)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { amount: 0.65, margin: '0px 0px -10% 0px' });
  // Interaction-Gate: nur nach echter User-Interaktion (vermeidet Auto-Start bei Page-Load)
  const [userInteracted, setUserInteracted] = useState(false);
  useEffect(() => {
    const onWheel = () => setUserInteracted(true);
    const onTouchStart = () => setUserInteracted(true);
    const onKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowDown', 'PageDown', 'Space', ' '];
      if (keys.includes(e.key)) setUserInteracted(true);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  const armed = instant ? true : (userInteracted && inView);
  const [playOrbits, setPlayOrbits] = useState<boolean>(!!instant);
  const paused = !!instant || !armed;

  // Tone-dependent accents removed; scene uses unified icon tokens and neutral glows.

  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize({ w: cr.width, h: cr.height });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Keine Sichtbarkeits-/Pause-Logik erforderlich

  // Compute radii based on the smaller side of the container
  const { rOuter, rMid, rInner } = useMemo(() => {
    const minSide = Math.max(0, Math.min(size.w || 0, size.h || 0));
    // Fallback if not measured yet
    const fallback = 320; // px
    const base = minSide > 0 ? minSide : fallback;
    // Leave a tiny margin to avoid touching edges
    const margin = 6;
    const maxRadius = Math.max(0, base / 2 - margin);
    // Layer ratios tuned to maintain aesthetics and avoid overlap
    // slightly larger rings for a fuller look
    const rOuter = Math.floor(maxRadius * 0.98);
    const rMid = Math.floor(maxRadius * 0.78);
    const rInner = Math.floor(maxRadius * 0.52);
    return { rOuter, rMid, rInner };
  }, [size.w, size.h]);

  // Dynamische Skalierung der Orbit-Elementgrößen je nach verfügbarem Platz (Mobile kompakter)
  const scale = useMemo(() => {
    const baseW = Math.max(1, size.w || 320);
    // Clampen: sehr schmal -> 0.75, normal -> 1.0, großzügig bis 1.15 auf Desktop
    return Math.min(1.15, Math.max(0.7, baseW / 420));
  }, [size.w]);

  // Sicherheits-Padding für den äußersten Orbit, damit Icons/Glows nie am Rand abgeschnitten werden
  // berücksichtigt: Icon-Container, Halo und subtile Bob/Suction-Bewegung
  const outerSafePad = useMemo(() => {
    // Exakte Geometrie: größter Glow-Durchmesser im äußeren Orbit (glowVariant "medium")
    // maxHalo = iconPx + haloAdd(strong/medium/soft) + extraRadialGlow(18)
    const iconPx = 22 * scale; // angepasst an äußeren Orbit (s. unten iconPx)
    const haloAdd = 18; // medium
    const maxRadial = 18; // zusätzliche Radial-Glow-Schicht
    const largestDiameter = iconPx + haloAdd + maxRadial; // px
    const halfLargest = largestDiameter * 0.5; // vom Icon-Zentrum nach außen
    const margin = 2; // minimaler Puffer, damit Glows nicht clippen
    return Math.round(halfLargest + margin);
  }, [scale]);

  // Größe der Glas-Scheibe (Glasmorphism) in der Mitte – bewusst kleiner als der Durchmesser des inneren Orbits
  const glassSize = useMemo(() => {
    // ca. 60% des inneren Orbit-Durchmessers, gedeckelt für XS-Devices
    const diameter = Math.max(120, Math.round(rInner * 1.2));
    return diameter;
  }, [rInner]);

  // Kein Parallax mehr
  const parallax = { x: 0, y: 0 };

  // Keine Maus-/Parallax-Events mehr

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-auto md:h-full lg:h-full overflow-hidden"
    >
      <div className="relative grid h-full place-items-center">
        {/* Orbits with depth occlusion: far outer -> outer -> glass disc -> inner */}
        {/* Waves entfernt – statisch */}
        <UnifiedOrbit
          preset="hero"
          icons={iconsC}
          radius={Math.max(0, rOuter - outerSafePad)}
          duration={96}
          direction={1}
          phaseOffsetDeg={31}
          glowVariant="medium"
          itemSize={Math.round(48 * scale)}
          iconPx={Math.round(22 * scale)}
          iconSpinAlternate
          iconSpinDuration={34}
          parallaxOffset={parallax}
          parallaxScale={14}
          driftDeg={playOrbits ? 7 : 0}
          driftDuration={playOrbits ? 20 : 0}
          speedFactor={speedFactor * 1.1}
          rotate={playOrbits}
          paused={paused}
        />
        <UnifiedOrbit
          preset="hero"
          icons={iconsB}
          radius={rMid}
          duration={84}
          direction={-1}
          phaseOffsetDeg={14}
          glowVariant="soft"
          dashedAccent={false}
          itemSize={Math.round(50 * scale)}
          iconPx={Math.round(24 * scale)}
          iconSpinAlternate
          iconSpinDuration={38}
          parallaxOffset={parallax}
          parallaxScale={10}
          driftDeg={playOrbits ? 6 : 0}
          driftDuration={playOrbits ? 24 : 0}
          speedFactor={speedFactor * 1.0}
          rotate={playOrbits}
          paused={paused}
        />

        {/* Zentrale Glass-Disc entfernt; nur Login-Agent bleibt in der Mitte, Orbits unverändert */}

        <UnifiedOrbit
          preset="hero"
          icons={iconsA}
          radius={rInner}
          duration={64}
          direction={-1}
          phaseOffsetDeg={0}
          glowVariant="soft"
          itemSize={Math.round(42 * scale)}
          iconPx={Math.round(20 * scale)}
          dashedAccent={false}
          counterDashedAbove={false}
          iconSpinAlternate
          iconSpinDuration={28}
          parallaxOffset={parallax}
          parallaxScale={10}
          driftDeg={playOrbits ? 4 : 0}
          driftDuration={playOrbits ? 16 : 0}
          speedFactor={speedFactor * 0.95}
          rotate={playOrbits}
          paused={paused}
        />

        {/* Einheitlicher zentraler Agent (Login-Variante) – exakt zentriert, Orbits starten via onReady */}
        <div className="z-30 pointer-events-none absolute inset-0 grid place-items-center">
          <AgentAvatar
            size={80}
            variant="login"
            instant={instant}
            onReady={() => {
              if (instant || armed) setPlayOrbits(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

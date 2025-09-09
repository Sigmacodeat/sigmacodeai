import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UNIFIED_ICON_SET, TOOL_COLORS } from '../shared/VisualUtils';
import AgentAvatar from '../shared/AgentAvatar';
import IconTool from '../shared/IconTool';

export type AgentLaunchSceneProps = {
  instant?: boolean;
  // armed: externer Gate (z. B. Scroll + InView). Solange false, startet nichts automatisch.
  armed?: boolean;
  maxAgents?: number; // Maximale Anzahl der Agenten
  toolsPerAgent?: number;
};

// Diese Szene animiert:
// 1) Kleine Agenten, die aus der Mitte "herausgeschossen" werden (Launch) bis auf eine mittlere Orbitbahn
// 2) Danach rotieren die Agenten im Orbit (kontinuierlich)
// 3) Um jeden Agenten kreisen kleinere Tool-Icons; gelegentlich werden sie elegant "eingesogen" und erscheinen wieder
// 4) Respektiert Reduced Motion via `instant` (pausiert alle Bewegungen)
export default function AgentLaunchScene({
  instant = false,
  armed = false,
  maxAgents = 5, // Maximale Anzahl der Agenten
  toolsPerAgent = 3,
}: AgentLaunchSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [ready, setReady] = useState<boolean>(!!instant);
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);

  // ToolIcon wird nun zentral über IconTool bereitgestellt

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        const w = Math.round(cr.width);
        const h = Math.round(cr.height);
        // nur aktualisieren, wenn sich die gerundeten Maße wirklich ändern
        setSize((prev) => (prev.w !== w || prev.h !== h ? { w, h } : prev));
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Hinweis: frühere tone-abhängige Farben wurden entfernt – Tools nutzen feste, zugängliche Farben.

  const minSide = Math.max(0, Math.min(size.w || 0, size.h || 0));
  const base = minSide > 0 ? minSide : 420;
  const orbitRadius = Math.floor((base / 2) * 0.72);
  // BotCore Icon ist 56px (h-14 w-14). Mini-Agent-Icon = 50% davon = 28px.
  const mainCoreIconPx = 56;
  const miniIconPx = Math.round(mainCoreIconPx * 0.5); // 28px
  // Unser Agenten-Container nutzt bislang icon ~ 56% von agentSize. Um 28px Icon zu erreichen:
  const agentSize = Math.round(miniIconPx / 0.56);
  const toolSize = Math.max(10, Math.round(miniIconPx * 0.42));
  // Der dekorative Orbit-Ring soll die Agents nicht schneiden: etwas kleiner als orbitRadius
  const orbitRingR = Math.max(0, orbitRadius - Math.round(agentSize * 0.6));

  // Augen-Geometrie exakt wie beim großen Icon (Brand 24x24) skaliert auf 100x100 ViewBox
  // Mapping: 24->100 => Scale = 100/24
  const VB_SCALE = 100 / 24;
  // Der große Login-Agent nutzt aktuell eyeRadius=1.0 (24er Space) => Mini-Agenten sollen matchen
  const MINI_EYE_RADIUS_24 = 1.0; // falls zentral geändert wird, hier anpassen
  const MINI_EYE_R = MINI_EYE_RADIUS_24 * VB_SCALE; // ≈ 4.1667
  const MINI_EYE_CX_L = 9 * VB_SCALE;  // 37.5
  const MINI_EYE_CX_R = 15 * VB_SCALE; // 62.5
  const MINI_EYE_CY = 13 * VB_SCALE;   // 54.1667

  // Stabil verteilte Winkel für Agenten
  const agentAngles = useMemo(() => {
    return new Array(maxAgents).fill(0).map((_, i) => (i / maxAgents) * 360 + 10 * (i % 3));
  }, [maxAgents]);

  // Tools aus dem gemeinsamen Icon-Set beziehen
  const toolIcons = useMemo(() => {
    const icons = UNIFIED_ICON_SET.slice(0, Math.max(5, toolsPerAgent + 2));
    return icons;
  }, [toolsPerAgent]);

  // Einheitliche Farbpalette aus VisualUtils

  // Szene spielt erst NACH Augen-Animation des Login-Icons + Scroll-Trigger
  const [play, setPlay] = useState<boolean>(false);
  // Zähler pro Tool-Instance, um Icons nach jedem Animationszyklus zu wechseln
  const [toolCycles, setToolCycles] = useState<Record<string, number>>({});
  const bumpToolCycle = (key: string) => {
    setToolCycles((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  };

  const paused = !!instant || !armed;

  // Fallback: Falls onReady nicht feuert, nach 1200ms automatisch "ready"
  useEffect(() => {
    if (!armed) return; // erst wenn gewaffnet (Scroll-Gate)
    if (ready || paused) return;
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, [armed, ready, paused]);

  // Scroll-Trigger via IntersectionObserver: einmalig starten, wenn Mittelpunkt ~30% VP
  useEffect(() => {
    if (!armed) return; // erst starten, wenn Scroll-Gate offen
    if (paused) return; // Reduced Motion oder unarmed: nicht starten
    const el = containerRef.current;
    if (!el) return;

    const TRIGGER_RATIO = 0.30; // 30% der Viewport-Höhe
    const TOLERANCE = 0.08; // etwas großzügiger

    const evaluateNow = () => {
      if (hasPlayed || !ready) return;
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const ratio = centerY / vh;
      if (
        ratio > (TRIGGER_RATIO - TOLERANCE) && ratio < (TRIGGER_RATIO + TOLERANCE)
      ) {
        setPlay(true);
        setHasPlayed(true);
      } else if (
        // Fallback: wenn die Szene gut sichtbar ist (Mitte im 15–70%-Bereich), trotzdem starten
        ratio > 0.15 && ratio < 0.70
      ) {
        setPlay(true);
        setHasPlayed(true);
      }
    };

    // IO beobachtet die Szene generell; wir starten direkt, sobald sichtbar und ready
    const io = new IntersectionObserver(
      (entries) => {
        if (hasPlayed || !ready) return;
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        // Sofort starten, sobald sichtbar
        setPlay(true);
        setHasPlayed(true);
      },
      {
        root: null,
        // Wir wollen eher früh informiert werden; rootMargin so, dass der 30%-Bereich zuverlässig erfasst wird
        rootMargin: '-30% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    io.observe(el);
    // Sofortige Initial-Prüfung (z. B. bei direktem Load im Sichtbereich)
    evaluateNow();

    return () => {
      io.disconnect();
    };
  }, [armed, paused, ready, hasPlayed]);

  // Entfernt: kein zeitbasierter Auto-Start – Start nur durch Scroll/Visibility (armed + IO)

  // Parallax (sehr subtil, Desktop): ±2px anhand Mausposition
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let targetX = 0, targetY = 0;
    const AMPL = 2; // px
    const onMove = (e: MouseEvent) => {
      if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / rect.width) * 2; // -1..1
      const dy = ((e.clientY - cy) / rect.height) * 2;
      targetX = Math.max(-1, Math.min(1, dx)) * AMPL;
      targetY = Math.max(-1, Math.min(1, dy)) * AMPL;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      el.style.setProperty('--px', `${targetX.toFixed(2)}px`);
      el.style.setProperty('--py', `${targetY.toFixed(2)}px`);
      raf = 0;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove as any);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-[5/4] overflow-hidden">
      {/* Lokale Keyframes und Styles – kapselt die Szene */}
      <style>{`
        :host, :root, .agent-scene-root {
          --glow-primary: rgba(125,211,252,0.16);
          --glow-secondary: rgba(14,165,233,0.12);
          --orbit-stroke: rgba(125,211,252,0.32);
          --counter-rotate-duration: 96s;
        }
        @keyframes agent-launch {
          0% { transform: translate(-50%, -50%) translate(0px, 0px) scale(0.72); opacity: 0; filter: blur(2px); }
          40% { opacity: 1; filter: blur(0px); }
          100% { transform: var(--agent-target-transform) scale(1); opacity: 1; filter: blur(0px); }
        }
        @keyframes agent-tool-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes tool-suction {
          /* Start: am Orbit */
          0% { translate: var(--tool-x) var(--tool-y); scale: 1; opacity: 0.95; }
          35% { translate: calc(var(--tool-x) * 0.8) calc(var(--tool-y) * 0.8); scale: 1.04; opacity: 0.96; }
          60% { translate: calc(var(--tool-x) * 0.5) calc(var(--tool-y) * 0.5); scale: 0.96; opacity: 0.92; }
          /* Einsaugen zum Zentrum */
          80% { translate: 0 0; scale: 0.86; opacity: 0; }
          /* Sofort am Orbit neu platzieren – noch unsichtbar */
          81% { translate: var(--tool-x) var(--tool-y); scale: 0.9; opacity: 0; }
          /* Pop zurück am Orbit */
          100% { translate: var(--tool-x) var(--tool-y); scale: 1; opacity: 0.95; }
        }
        .scene-rotate {
          animation: agent-orbit-rotate var(--orbit-duration, 84s) linear infinite;
          animation-play-state: var(--scene-play, running);
        }
        @keyframes agent-orbit-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .agent-launch {
          animation: agent-launch var(--agent-launch-duration, 1000ms) cubic-bezier(.2,.8,.2,1) both;
          animation-delay: var(--agent-launch-delay, 0ms);
          animation-play-state: var(--scene-play, running);
          will-change: transform, opacity;
        }
        .tools-ring {
          animation: agent-tool-spin var(--tools-spin-duration, 14s) linear infinite;
          animation-play-state: var(--scene-play, running);
          transform-origin: center;
          will-change: transform;
        }
        /* Entfernt: Hover-Beschleunigung, da sie Animationen resetten kann */
        /* Sanftes Schweben für Mini-Agenten */
        @keyframes agent-agent-float {
          0% { transform: translateY(-1.5px); }
          50% { transform: translateY(1.5px); }
          100% { transform: translateY(-1.5px); }
        }
        .agent-float {
          animation: agent-agent-float 3.6s ease-in-out infinite alternate;
          animation-play-state: var(--scene-play, running);
          will-change: transform;
        }
        /* Gegenrotation-Klasse bleibt für Tools erhalten; Agenten verwenden sie nicht mehr */
        .counter-rotate {
          animation: agent-orbit-rotate var(--counter-rotate-duration, var(--orbit-duration, 84s)) linear infinite reverse;
          animation-play-state: var(--scene-play, running);
          transform-origin: center;
          will-change: transform;
        }
        .tool-counter {
          animation: agent-tool-spin var(--tools-spin-duration, 14s) linear infinite reverse;
          animation-play-state: var(--scene-play, running);
          transform-origin: center;
          will-change: transform;
        }
        .tool-item {
          animation: tool-suction var(--tool-ingest-duration, 6.5s) cubic-bezier(0.33, 1, 0.68, 1) infinite both;
          animation-delay: var(--tool-ingest-delay, 0ms);
          animation-play-state: var(--scene-play, running);
          will-change: translate, opacity, scale;
        }
        @media (prefers-reduced-motion: reduce) {
          .agent-launch,
          .tools-ring,
          .tool-item,
          .agent-float,
          .counter-rotate,
          .tool-counter { animation: none !important; }
        }
        /* Farbiger Glow um Tool-Icons in Brand-Farbe */
        @keyframes agent-tool-glow-pulse {
          0% { opacity: 0.90; }
          50% { opacity: 0.98; }
          100% { opacity: 0.90; }
        }
        .tool-glow {
          animation: agent-tool-glow-pulse 3.6s ease-in-out infinite;
          will-change: opacity, filter;
        }
        /* Glow-Pulse für Mini-Agenten-Icons (dezenter als Tools) */
        @keyframes agent-agent-glow-pulse {
          0% { opacity: 0.94; }
          50% { opacity: 0.99; }
          100% { opacity: 0.94; }
        }
        .agent-glow {
          animation: agent-agent-glow-pulse 4.2s ease-in-out infinite;
          will-change: opacity, filter;
        }
        /* Dekorative Orbit-Ringe (SVG-basiert für runde Dash-Kanten) */
        .orbit-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .orbit-svg { pointer-events: none; }
        .orbit-svg {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          will-change: transform;
        }
        .orbit-layer-abs {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .orbit-stroke--dashed {
          fill: none;
          stroke: var(--orbit-stroke);
          stroke-width: 1.6;
          stroke-dasharray: 5 13;
          stroke-linecap: round;
          filter: drop-shadow(0 0 18px rgba(125,211,252,0.14));
          mix-blend-mode: screen;
        }
        .orbit-stroke--dashed.farther {
          /* minimal andere Strichlänge für subtilen Parallel-Effekt */
          stroke-dasharray: 5 12;
          stroke-width: 1.6;
        }
        .parallax-layer { transform: translate3d(var(--px, 0px), var(--py, 0px), 0); will-change: transform; }
      `}</style>

      {/* Global SVG defs: Brand gradient for agent icon strokes */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="brandOrbitGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="55%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#cffafe" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="absolute inset-0 grid place-items-center agent-scene-root"
        style={{
          // globale Steuerung für Pause
          // nutzt die gleichen Semantiken wie OrbitLayer
          // running|paused
          '--scene-play': paused || !play ? 'paused' : 'running',
          '--orbit-duration': '92s',
          '--counter-rotate-duration': '102s',
        } as React.CSSProperties & Record<string, string>}
      >
        {/* Zentrale Disc entfernt: kein dunkler runder Kreis hinter dem Robo-Icon */}

        {/* Einheitlicher zentraler Agent (Login-Variante); nach onReady startet die Szene */}
        <div className="absolute inset-0 grid place-items-center z-30" aria-hidden>
          <AgentAvatar size={80} variant="login" instant={instant} onReady={() => setReady(true)} />
        </div>

        {/* Dekorative Orbit-Pfade: ein konzentrischer, gestrichelter Ring (kleiner als Agentenbahn) */}
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none parallax-layer">
          <div className="orbit-center relative">
            {/* Ein gestrichelter Ring (kleiner als orbitRadius, gleicher Mittelpunkt) */}
            <div className="orbit-layer-abs">
              <div className="counter-rotate" style={{ ['--orbit-duration' as any]: '140s', ['--counter-rotate-duration' as any]: '108s', transform: 'rotate(24deg)' }}>
                <svg className="orbit-svg" width={orbitRingR * 2} height={orbitRingR * 2}>
                  <circle className="orbit-stroke--dashed farther" cx={orbitRingR} cy={orbitRingR} r={orbitRingR} strokeDashoffset={-6} />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Statischer Layer für die Agenten auf der mittleren Orbitbahn (keine kontinuierliche Rotation) */}
        <div className="absolute inset-0">
          {agentAngles.map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * orbitRadius;
            const y = Math.sin(rad) * orbitRadius;
            const delay = 220 + idx * 120; // Staffelung Launch
            const toolsSpin = 12 + (idx % 3) * 2; // leichte Varianz

            return (
              <div
                key={idx}
                className="absolute left-1/2 top-1/2"
                style={{
                  // Zielposition nach Launch
                  // translate(-50%,-50%) + Offset auf Orbit
                  // in CSS-Var für die Keyframes
                  '--agent-target-transform': `translate(-50%, -50%) translate(${Math.round(x)}px, ${Math.round(y)}px)`,
                  '--agent-launch-delay': `${delay}ms`,
                  '--agent-launch-duration': '900ms',
                } as React.CSSProperties & Record<string, string>}
              >
                {/* Agent: Launch-Animation aus dem Zentrum oder statisch bei Reduced Motion */}
                {paused ? (
                  <div
                    style={{
                      transform: `translate(-50%, -50%) translate(${Math.round(x)}px, ${Math.round(y)}px)`,
                      opacity: 1,
                    }}
                  >
                    <div
                      className="relative z-20 grid place-items-center agent-float"
                      style={{ width: agentSize, height: agentSize }}
                      aria-label={`Agent ${idx + 1}`}
                    >
                      <div className="relative grid place-items-center agent-glow" style={{ filter: 'drop-shadow(0 0 8px var(--glow-primary)) drop-shadow(0 0 16px var(--glow-secondary))' }}>
                        {/* Tools-Ring um den Agenten (hinter dem Kopf-Icon) */}
                        <div
                          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
                          style={{ width: Math.round(agentSize * 1.9), height: Math.round(agentSize * 1.9) }}
                          aria-hidden
                        >
                          <div
                            className="tools-ring w-full h-full parallax-layer"
                            style={{ '--tools-spin-duration': `${toolsSpin}s` } as React.CSSProperties & Record<string, string>}
                          >
                          {new Array(toolsPerAgent).fill(0).map((_, ti) => {
                            const a = (ti / toolsPerAgent) * 360;
                            const r = Math.round(agentSize * 0.95);
                            const tx = Math.cos((a * Math.PI) / 180) * r;
                            const ty = Math.sin((a * Math.PI) / 180) * r;
                            const keyId = `${idx}-${ti}`;
                            const cycle = toolCycles[keyId] ?? 0;
                            const Icon = toolIcons[(idx + ti + cycle) % toolIcons.length];
                            const ingestDelay = (idx * 1100 + ti * 1700) % 4000; // unregelmäßig
                            const ingestDur = 5200 + (ti % 2) * 800;
                            return (
                              <div key={ti} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div
                                  className="tool-item"
                                  style={{
                                    '--tool-ingest-delay': `${ingestDelay}ms`,
                                    '--tool-ingest-duration': `${ingestDur}ms`,
                                    '--tool-x': `${tx}px`,
                                    '--tool-y': `${ty}px`,
                                  } as React.CSSProperties & Record<string, string>}
                                  onAnimationIteration={() => bumpToolCycle(keyId)}
                                >
                                  <div className="tool-counter counter-rotate tool-glow will-change-transform" style={{ willChange: 'transform' }}>
                                    <IconTool icon={Icon} size={toolSize} color={TOOL_COLORS[ti % TOOL_COLORS.length]} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          </div>
                        </div>
                        <AgentAvatar size={agentSize} variant="plain" instant={instant} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="agent-launch">
                    <div
                      className="relative z-10 grid place-items-center agent-float"
                      style={{ width: agentSize, height: agentSize }}
                      aria-label={`Agent ${idx + 1}`}
                    >
                      <div className="relative grid place-items-center agent-glow" style={{ filter: 'drop-shadow(0 0 10px rgba(125,211,252,0.20)) drop-shadow(0 0 20px rgba(14,165,233,0.14))' }}>
                        {/* Tools-Ring um den Agenten (hinter dem Kopf-Icon) */}
                        <div
                          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
                          style={{ width: Math.round(agentSize * 1.9), height: Math.round(agentSize * 1.9) }}
                          aria-hidden
                        >
                          <div
                            className="tools-ring w-full h-full"
                            style={{ '--tools-spin-duration': `${toolsSpin}s` } as React.CSSProperties & Record<string, string>}
                          >
                            <div className="tools-ring-inner">
                              {new Array(toolsPerAgent).fill(0).map((_, ti) => {
                                const a = (ti / toolsPerAgent) * 360;
                                const r = Math.round(agentSize * 0.95);
                                const tx = Math.cos((a * Math.PI) / 180) * r;
                                const ty = Math.sin((a * Math.PI) / 180) * r;
                                const keyId = `${idx}-${ti}`;
                                const cycle = toolCycles[keyId] ?? 0;
                                const Icon = toolIcons[(idx + ti + cycle) % toolIcons.length];
                                const ingestDelay = (idx * 1100 + ti * 1700) % 4000; // unregelmäßig
                                const ingestDur = 5200 + (ti % 2) * 800;
                                return (
                                  <div key={ti} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div
                                      className="tool-item"
                                      style={{
                                        '--tool-ingest-delay': `${ingestDelay}ms`,
                                        '--tool-ingest-duration': `${ingestDur}ms`,
                                        '--tool-x': `${tx}px`,
                                        '--tool-y': `${ty}px`,
                                      } as React.CSSProperties & Record<string, string>}
                                      onAnimationIteration={() => bumpToolCycle(keyId)}
                                    >
                                      <div className="tool-counter counter-rotate tool-glow will-change-transform" style={{ willChange: 'transform' }}>
                                        <IconTool icon={Icon} size={toolSize} color={TOOL_COLORS[ti % TOOL_COLORS.length]} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <AgentAvatar size={agentSize} variant="plain" instant={instant} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

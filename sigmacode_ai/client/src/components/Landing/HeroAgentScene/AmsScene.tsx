import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AGENT_ICON, UNIFIED_ICON_SET } from '../shared/VisualUtils';

export type AmsSceneProps = {
  tone?: 'indigo' | 'teal' | 'amber' | 'violet' | 'pink' | 'neutral';
  instant?: boolean; // reduced motion -> skip launch
  agents?: number; // how many agents to show
};

export default function AmsScene({ tone = 'teal', instant = false, agents = 6 }: AmsSceneProps) {
  // Statisch: keine Awake-Phase notwendig

  // Measure container to position agents responsively
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const prevSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      // Verwende gerundete Werte und update nur bei echter Änderung
      for (const entry of entries) {
        const cr = entry.contentRect;
        const w = Math.round(cr.width);
        const h = Math.round(cr.height);
        const prev = prevSizeRef.current;
        if (w !== prev.w || h !== prev.h) {
          prevSizeRef.current = { w, h };
          setSize({ w, h });
        }
      }
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
    };
  }, []);

  // Tone mapping -> RGB for subtle shadows/glow accents
  const toneRgb = useMemo(() => {
    const map: Record<string, [number, number, number]> = {
      indigo: [79, 70, 229],
      teal: [20, 184, 166],
      amber: [245, 158, 11],
      violet: [139, 92, 246],
      pink: [236, 72, 153],
      neutral: [148, 163, 184],
    };
    return map[tone] ?? map.teal;
  }, [tone]);

  // Compute a ring radius for the agents (single ring, focused)
  const { rAgents } = useMemo(() => {
    const minSide = Math.max(0, Math.min(size.w || 0, size.h || 0));
    const base = minSide > 0 ? minSide : 420; // fallback
    const margin = 18; // leave space for glow
    const r = Math.max(80, Math.floor(base / 2 - margin));
    return { rAgents: r * 0.6 };
  }, [size.w, size.h]);

  // Agent visuals scale with width
  const scale = useMemo(() => {
    const baseW = Math.max(1, size.w || 360);
    return Math.min(1.15, Math.max(0.8, baseW / 520));
  }, [size.w]);

  const Icon = AGENT_ICON;

  // positions: distribute a few big agents around a single ring, slight jitter
  const positions = useMemo(() => {
    const count = Math.max(3, Math.min(10, agents));
    const arr = new Array(count).fill(0).map((_, i) => i);
    return arr.map((i) => {
      const baseAngle = (i / count) * 360;
      const jitter = (i * 37) % 23; // simple deterministic jitter source
      const angle = baseAngle + (jitter - 11.5) * 0.6; // ± ~7°
      const rad = (angle * Math.PI) / 180;
      const radius = rAgents * (0.92 + ((i * 19) % 7) * 0.01); // small radius offsets
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;
      const delay = 0.08 * i; // stagger launch
      return { x: Math.round(x), y: Math.round(y), delay };
    });
  }, [agents, rAgents]);

  const agentSize = Math.round(72 * scale); // container box
  const iconPx = Math.round(34 * scale); // icon size
  const orbitR = Math.max(12, Math.round(18 * scale)); // Orbit-Radius für Tool-Icons
  const orbitIcon = Math.max(10, Math.round(12 * scale));

  return (
    <div
      ref={containerRef}
      className="ams-root ams-force-motion relative w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-[5/4] overflow-hidden"
    >
      {/* connection lines */}
      <svg className="absolute inset-0 z-0" viewBox="-50 -50 100 100" aria-hidden>
        {positions.map((p, i) => {
          const rad = (Math.hypot(p.x, p.y) / (rAgents || 1)) * 50; // normalize to viewBox
          const a = Math.atan2(p.y, p.x);
          const x = rad * Math.cos(a);
          const y = rad * Math.sin(a);
          const dash = 5 + (i % 4) * 1.5;
          const widthMin = 0.9;
          const widthMax = 1.8;
          const strokeCol = 'rgba(56, 189, 248, 0.6)';
          const glowCol = 'rgba(56, 189, 248, 0.25)';
          return (
            <g key={`ln-${i}`}>
              <line x1={0} y1={0} x2={x} y2={y} stroke={glowCol} strokeWidth={widthMax + 0.6} strokeLinecap="round" strokeDasharray={`${dash} ${dash * 2}`} />
              <line x1={0} y1={0} x2={x} y2={y} stroke={strokeCol} strokeLinecap="round" strokeDasharray={`${dash} ${dash * 2}`} strokeWidth={widthMin} />
              <circle cx={x} cy={y} r={1.8} fill="rgba(56,189,248,0.9)" />
            </g>
          );
        })}
      </svg>

      {/* central main agent (nicht entfernen) */}
      <div className="pointer-events-none absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative grid place-items-center rounded-full border border-white/25 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-2xl ams-core-glow"
          style={{
            width: Math.max(120, Math.round(rAgents * 0.95)),
            height: Math.max(120, Math.round(rAgents * 0.95)),
            boxShadow: `0 10px 48px -10px rgba(${toneRgb[0]}, ${toneRgb[1]}, ${toneRgb[2]}, 0.22)`,
          }}
        >
          <div aria-hidden className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(56,189,248,0.10) 45%, rgba(56,189,248,0.0) 70%)', filter: 'blur(8px)' }} />
          <Icon aria-hidden className="text-teal-300 drop-shadow-[0_0_14px_rgba(56,189,248,0.35)]" style={{ width: iconPx, height: iconPx }} strokeWidth={1.6} />
          {/* subtiler rotierender Ring */}
          <div className="ams-core-ring" />
        </div>
      </div>

      {/* agents */}
      <div className="absolute inset-0 z-30">
        {positions.map((p, i) => (
          <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* placer: statische Positionierung ohne Placer-Entry; Icons starten nach Awake */}
            <div
              className="ams-placer"
              style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
            >
              {/* actual agent with gentle bob */}
              <div
                className="ams-agent relative grid place-items-center rounded-full border border-white/25 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-sm"
                style={{
                  width: agentSize,
                  height: agentSize,
                }}
              >
                {/* halo */}
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(56,189,248,0.10) 45%, rgba(56,189,248,0.0) 70%)', filter: 'blur(8px)' }} />
                <Icon aria-hidden className="text-teal-300 drop-shadow-[0_0_14px_rgba(56,189,248,0.35)]" style={{ width: iconPx, height: iconPx }} strokeWidth={1.6} />
                {/* orbitierende Tool-Icons */}
                <div className="pointer-events-none absolute inset-0">
                  {UNIFIED_ICON_SET.slice(0, 2).map((ToolIcon, k) => {
                    // Option B: Entry nach Glow-Ende und sofortiger Orbit-Loop pro Icon
                    const radius = orbitR + k * 6;
                    const baseStart = 0.0; // sofort starten, um Sichtbarkeit zu verifizieren
                    const enterDur = 0.6; // s, sanfter Slide
                    const step = 0.2; // s zwischen Icons
                    const enterDelay = baseStart + k * step;
                    const rotDelay = enterDelay + enterDur; // Start Rot direkt nach Ankunft
                    const rotDur = 6.0; // s für volle Umdrehung
                    return (
                      <div
                        key={`${i}-${k}`}
                        className={`ams-orbit ams-orbit--k${k}`}
                        style={{
                          ['--orbit-r' as any]: `${radius}px`,
                        }}
                        aria-hidden
                      >
                        {/* per-icon rotator startet nach Entry-Ende */}
                        <div
                          className="absolute inset-0 ams-icon-rotator"
                          style={{
                            ['--icon-rot-delay' as any]: `${rotDelay}s`,
                            ['--icon-rot-dur' as any]: `${rotDur}s`,
                          }}
                        >
                          {/* orbit-item: fliegt vom Zentrum auf Radius */}
                          <div
                            className="ams-orbit-item ams-tool-enter"
                            style={{
                              ['--tool-enter-delay' as any]: `${enterDelay}s`,
                              ['--tool-enter-dur' as any]: `${enterDur}s`,
                            }}
                          >
                            <div className="ams-orbit-sprite">
                              <ToolIcon className="text-cyan-200/90 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" style={{ width: orbitIcon, height: orbitIcon }} />
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
        ))}
      </div>
    </div>
  );
}

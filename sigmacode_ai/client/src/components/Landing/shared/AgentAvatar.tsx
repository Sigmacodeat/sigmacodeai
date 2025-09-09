import React, { useEffect, useState } from 'react';
import LoginAgentIcon from '../components/LoginAgentIcon';
import { AGENT_ICON } from './VisualUtils';

export type AgentAvatarProps = {
  // Pixelgröße des Gesamtcontainers (quadratisch)
  size?: number;
  // Darstellung: Login-Icon mit Augen-Animation oder statisch/leicht animiert
  variant?: 'login' | 'plain';
  // Reduced motion: pausiert Animationen
  instant?: boolean;
  // Callback, wenn (bei variant=login) die Augen-Animation fertig ist
  onReady?: () => void;
  className?: string;
};

/**
 * Vereinheitlichte Agenten-Avatar-Darstellung für alle Sektionen.
 * - variant "login": nutzt das bestehende LoginAgentIcon (mit Augenanimation)
 * - variant "plain": zeichneter Bot (AGENT_ICON) mit dezentem Glow und Augenoverlay
 */
export default function AgentAvatar({ size = 80, variant = 'login', instant = false, onReady, className }: AgentAvatarProps) {
  // Wake-up State: steuert Graustufen -> Farbe/Glow Transition für "login"
  const [awake, setAwake] = useState<boolean>(!!instant);

  useEffect(() => {
    if (instant) setAwake(true);
  }, [instant]);

  if (variant === 'login') {
    return (
      <div
        className={[
          'relative inline-grid place-items-center transition-all duration-700',
          // Start: entsättigt und leicht transparent; Ziel: vollfarbig mit Glow
          awake
            ? 'opacity-100 filter-none'
            : 'opacity-80 grayscale contrast-90',
          className ?? '',
        ].join(' ')}
        // sanfte Glow-Schicht beim Awake
        style={{ filter: awake ? 'drop-shadow(0 0 12px rgba(56,189,248,0.22)) drop-shadow(0 0 24px rgba(14,165,233,0.16))' : undefined }}
      >
        <LoginAgentIcon
          size={size}
          eyeRadius={1.0}
          instant={instant}
          onReady={() => {
            setAwake(true);
            onReady?.();
          }}
        />
      </div>
    );
  }

  // "plain" Variante – angelehnt an AgentLaunchScene Mini-Agents
  const Icon = AGENT_ICON;
  const headOuter = Math.round(size * 0.60);
  const headInner = Math.round(size * 0.56);

  // Augen-Overlay wie in AgentLaunchScene skaliert (24 -> 100 ViewBox, eyeRadius=1.0)
  const VB_SCALE = 100 / 24;
  const MINI_EYE_R = 1.0 * VB_SCALE; // ~4.1667
  const MINI_EYE_CX_L = 9 * VB_SCALE;
  const MINI_EYE_CX_R = 15 * VB_SCALE;
  const MINI_EYE_CY = 13 * VB_SCALE;

  return (
    <div className={`relative grid place-items-center ${className ?? ''}`} style={{ width: size, height: size }} aria-hidden>
      <div className="relative grid place-items-center" style={{ filter: 'drop-shadow(0 0 10px rgba(125,211,252,0.20)) drop-shadow(0 0 20px rgba(14,165,233,0.14))' }}>
        <Icon
          className="text-black/55 dark:text-black/60 drop-shadow-[0_0_8px_rgba(0,0,0,0.35)]"
          style={{ width: headOuter, height: headOuter }}
          strokeWidth={2.4}
        >
          <style>{`
            path, circle, line, polyline, rect, polygon { stroke: url(#brandOrbitGrad) !important; }
          `}</style>
        </Icon>
        <Icon
          className="absolute text-white dark:text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.35)]"
          style={{ width: headInner, height: headInner }}
          strokeWidth={1.8}
        />
        {/* Eyes overlay */}
        <svg
          className="pointer-events-none absolute"
          width={headInner}
          height={headInner}
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            <linearGradient id="agentEyesGrad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#cffafe" />
            </linearGradient>
          </defs>
          <circle cx={MINI_EYE_CX_L} cy={MINI_EYE_CY} r={MINI_EYE_R} fill="url(#agentEyesGrad)" />
          <circle cx={MINI_EYE_CX_R} cy={MINI_EYE_CY} r={MINI_EYE_R} fill="url(#agentEyesGrad)" />
        </svg>
      </div>
    </div>
  );
}

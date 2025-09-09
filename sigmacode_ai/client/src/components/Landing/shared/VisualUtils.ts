// Shared visual utilities for Landing animations
// - Deterministic pseudo-random
// - Glow parameter presets
// - Mode-aware hue helpers

import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  Server,
  Database,
  Cloud,
  CircuitBoard,
  Cpu,
  ShieldCheck,
  Globe2,
  Lock,
  Key,
  Code2,
  Terminal,
  GitBranch,
  Package,
  Link,
  Zap,
} from 'lucide-react';

export type GlowVariant = 'soft' | 'medium' | 'strong';

// Deterministic in [0,1). Stable per integer seed
export function rand01(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export function getGlowParams(variant: GlowVariant) {
  switch (variant) {
    case 'strong':
      return { sizeAdd: 18, blur: 20, coreOpacity: 0.36, outerOpacity: 0.22 };
    case 'medium':
      return { sizeAdd: 14, blur: 16, coreOpacity: 0.28, outerOpacity: 0.16 };
    case 'soft':
    default:
      return { sizeAdd: 10, blur: 12, coreOpacity: 0.22, outerOpacity: 0.12 };
  }
}

// Pick a base hue range tuned to the canvas mode and add a small per-item jitter
export function hueForMode(mode: 'business' | 'agents' | 'mas', jitter: number) {
  // base ranges in degrees (indigo/violet family)
  if (mode === 'business') {
    // slightly bluer
    return 220 + jitter * 22; // 220..242
  }
  if (mode === 'agents') {
    return 218 + jitter * 26; // 218..244
  }
  // mas: slightly towards violet
  return 230 + jitter * 28; // 230..258
}

// Centralized motion tokens (easing + durations) for consistent animation behavior
// Inspired by Material emphasized curves, tuned for our brand feel
export const MotionTokens = {
  // cubic-bezier tuples
  easing: {
    emphasized: [0.22, 0.08, 0.14, 0.99] as [number, number, number, number],
    standard: [0.45, 0.05, 0.2, 0.95] as [number, number, number, number],
    entrance: [0.2, 0.7, 0.0, 1.0] as [number, number, number, number],
  },
  durations: {
    xshort: 0.35,
    short: 0.6,
    medium: 0.8,
    long: 1.2,
  },
} as const;


// Unified agent/icon tokens for all landing animations
export const AGENT_ICON = Bot;

// Order matters only for aesthetic grouping; consumers may slice per orbit/layer
export const UNIFIED_ICON_SET: LucideIcon[] = [
  Server,
  Database,
  Cloud,
  Globe2,
  Code2,
  Terminal,
  CircuitBoard,
  Cpu,
  ShieldCheck,
  Lock,
  Key,
  GitBranch,
  Package,
  Link,
  Zap,
];

// Login-parity agent set: exclusively the Bot icon for consistent styling
export const AGENT_ICON_SET: LucideIcon[] = [AGENT_ICON];

// Unified color palette for small tool icons around agents
export const TOOL_COLORS: string[] = [
  '#ff69b4', // hotpink
  '#32cd32', // limegreen
  '#ffa500', // orange
  '#ff1493', // deeppink
  '#00ff00', // green
  '#ff4500', // orangered
];


import React from 'react';
import OrbitLayer from '../HeroAgentScene/OrbitLayer';

export type UnifiedOrbitPreset = 'hero' | 'team' | 'default';

export type UnifiedOrbitProps = React.ComponentProps<typeof OrbitLayer> & {
  preset?: UnifiedOrbitPreset;
};

/**
 * Wrapper um OrbitLayer mit einheitlichen Defaults je nach Einsatzgebiet (Hero/Team).
 * Akzeptiert alle OrbitLayer-Props, wobei eingehende Props die Preset-Defaults überschreiben.
 */
export default function UnifiedOrbit({ preset = 'default', ...rest }: UnifiedOrbitProps) {
  // Preset-Defaults: bewusst dezent, um Background-Glow im Hero gering zu halten
  const baseDefaults: Partial<React.ComponentProps<typeof OrbitLayer>> = {
    duration: 56,
    direction: 1,
    glowVariant: 'medium',
    itemSize: 48,
    iconPx: 24,
    iconSpinAlternate: false,
    iconSpinDuration: 0,
    iconSpinMode: 'none',
    iconSpinRatio: 0,
    dashedAccent: false,
    counterDashedAbove: false,
    parallaxScale: 0,
    driftDeg: 0,
    driftDuration: 24,
    speedFactor: 1,
    rotate: false,
    lockOnCircle: false,
    paused: true,
    showOrbitRings: true,
  };

  const heroDefaults: Partial<React.ComponentProps<typeof OrbitLayer>> = {
    glowVariant: 'medium',
    showOrbitRings: true,
  };

  const teamDefaults: Partial<React.ComponentProps<typeof OrbitLayer>> = {
    glowVariant: 'strong',
    showOrbitRings: true,
    direction: -1,
  };

  const presetDefaults = preset === 'hero' ? heroDefaults : preset === 'team' ? teamDefaults : {};

  return <OrbitLayer {...{ ...baseDefaults, ...presetDefaults, ...rest }} />;
}

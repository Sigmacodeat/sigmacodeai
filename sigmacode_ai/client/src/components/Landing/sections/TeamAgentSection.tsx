// no local animation library usage needed here
import { useTranslation } from 'react-i18next';
import AgentAvatar from '../shared/AgentAvatar';
// Header entfernt – minimalistischer Abschnitt nur mit Orbit + Agent
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import UnifiedOrbit from '../shared/UnifiedOrbit';
import LandingSection from '../components/LandingSection';
import SectionHeader from '../../marketing/SectionHeader';

// entfernte Debug-/Deko-Helfer und Spokes

export default function TeamAgentSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  // Zwei visuelle Ringe; die Icons laufen exakt mittig dazwischen
  const R_INNER = 160;
  const R_OUTER = 240;
  // kleiner visueller Offset (Ring-Stroke/Glow wirkt optisch nach außen) -> Feinkorrektur
  const ICON_RADIUS_OFFSET = -4; // px; stärkere Feinkorrektur gegen optischen Ring-Offset
  const R_ICONS = Math.round((R_INNER + R_OUTER) / 2 + ICON_RADIUS_OFFSET);
  // leichte Linksverschiebung, um optisch perfekt zu zentrieren
  const CENTER_OFFSET_X = -4; // px nach links; bei Bedarf feintunen (-3/-5)
  // ausgewogene Reihenfolge (abwechselnd Symbole/Shapes), statt einfach slice(0,6)
  const ICONS = [
    UNIFIED_ICON_SET[0], // Server
    UNIFIED_ICON_SET[4], // Code2
    UNIFIED_ICON_SET[1], // Database
    UNIFIED_ICON_SET[5], // Terminal
    UNIFIED_ICON_SET[3], // Globe2
    UNIFIED_ICON_SET[2], // Cloud
  ];
  const ITEM_SIZE = 40; // kompakter -> mehr Luft zur Ringlinie
  const PHASE = 0; // neutraler Startwinkel für gleichmäßige Verteilung
  const CONTAINER_H = R_OUTER * 2 + 40; // Bühne umfasst äußeren Ring

  return (
    <LandingSection id="team-agents" className="-mt-px">
        {/* Einheitlicher Header via SectionHeader */}
        <div className="mx-auto max-w-3xl">
          <SectionHeader
            id="team-agents-heading"
            badgeText={tt('marketing.landing.sections.badges.providers', 'Provider')}
            title={tt('landing.teamAgents.title', 'Agenten, die sich ihre Informationen holen')}
            subtitle={tt('landing.teamAgents.subtitle', 'Ein koordiniertes Agenten-Team orchestriert Datenquellen, sammelt Kontext und liefert präzise Ergebnisse – zuverlässig und nachvollziehbar.')}
            badgeAlign="center"
            subtitleClassName="mt-2 text-center"
          />
        </div>
        <div className="relative mx-auto mt-12" style={{ height: CONTAINER_H, width: CONTAINER_H }}>
          {/* Zentraler Agent (einheitliche Darstellung) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <AgentAvatar size={80} variant="plain" />
          </div>
          {/* Zwei Orbit-Ringe (rein visuell) – ohne innere Akzent-Insets */}
          <UnifiedOrbit preset="team" icons={[]} radius={R_OUTER} duration={72} direction={-1} glowVariant="medium" parallaxOffset={{ x: CENTER_OFFSET_X, y: 0 }} parallaxScale={0} />
          <UnifiedOrbit preset="team" icons={[]} radius={R_INNER} duration={56} direction={-1} glowVariant="medium" parallaxOffset={{ x: CENTER_OFFSET_X, y: 0 }} parallaxScale={0} />
          {/* Elegante Pfad-Ringe auf der Icon-Bahn: subtil + gestrichelt gegenläufig */}
          <UnifiedOrbit
            preset="team"
            icons={[]}
            radius={R_ICONS}
            duration={110}
            direction={1}
            glowVariant="soft"
            parallaxOffset={{ x: CENTER_OFFSET_X, y: 0 }}
            parallaxScale={0}
            showOrbitRings
          />
          <UnifiedOrbit
            preset="team"
            icons={[]}
            radius={R_ICONS}
            duration={140}
            direction={-1}
            glowVariant="soft"
            parallaxOffset={{ x: CENTER_OFFSET_X, y: 0 }}
            parallaxScale={0}
            showOrbitRings
            dashedAccent
            counterDashedAbove
            phaseOffsetDeg={18}
          />
          {/* Icons innerhalb der Bandbreite zwischen den beiden Ringen */}
          <UnifiedOrbit
            preset="team"
            icons={ICONS}
            radius={R_ICONS}
            // Icons exakt mittig zwischen den Ringen, keine Bandbreite
            duration={62}
            direction={1}
            glowVariant="medium"
            itemSize={36}
            iconPx={18}
            dashedAccent={false}
            iconSpinAlternate
            iconSpinDuration={30}
            parallaxOffset={{ x: CENTER_OFFSET_X, y: 0 }}
            parallaxScale={0}
            phaseOffsetDeg={PHASE}
            driftDeg={0}
            driftDuration={0}
            speedFactor={1}
            lockOnCircle
            showOrbitRings
            rotate
            paused={false}
          />
        </div>
    </LandingSection>
  );
}

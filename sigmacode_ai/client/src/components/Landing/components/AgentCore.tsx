// Static version without animation library usage
import { AGENT_ICON } from '../shared/VisualUtils';

export type AgentCoreProps = {
  size?: number; // icon size in px
  glow?: boolean;
};

/**
 * Zentraler Bot-Avatar mit dezentem Halo/Glow und optionaler Atmung (scale loop).
 * Einheitlich für Sektionen wiederverwendbar.
 */
export default function AgentCore({ size = 80, glow = true }: AgentCoreProps) {
  return (
    <div className="relative" style={{ willChange: 'auto' }}>
      {glow && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ width: size + 30, height: size + 30, borderRadius: 9999, background: 'radial-gradient(circle, rgba(13,148,136,0.42) 0%, rgba(13,148,136,0.00) 70%)', filter: 'blur(12px)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ width: size + 90, height: size + 90, borderRadius: 9999, background: 'radial-gradient(circle, rgba(8,145,178,0.30) 0%, rgba(8,145,178,0.00) 70%)', filter: 'blur(22px)' }}
          />
        </>
      )}
      <AGENT_ICON className="text-teal-500" style={{ width: size, height: size }} />
    </div>
  );
}

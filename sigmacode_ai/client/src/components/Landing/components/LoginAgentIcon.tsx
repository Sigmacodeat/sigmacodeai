import React from 'react';
import Brand from '../../common/Brand';

export type LoginAgentIconProps = {
  size?: number; // px
  strokeWidth?: number;
  eyesDuration?: number; // seconds
  instant?: boolean; // skips intro like on login when needed
  className?: string;
  onReady?: () => void; // fires when eyes animation completes (from Brand)
  eyeRadius?: number; // in Brand's 24x24 space
};

export default function LoginAgentIcon({
  size = 80,
  strokeWidth = 1.6,
  eyesDuration = 0.5,
  instant = false,
  className,
  onReady,
  eyeRadius,
}: LoginAgentIconProps) {
  return (
    <div className={["relative inline-grid place-items-center", className ?? ''].join(' ')}>
      {/* Exakter Login-Icon mit Augen wie auf der Login-Page: Brand onlyIcon */}
      <Brand
        onlyIcon
        glow={false}
        iconSize={size}
        strokeWidth={strokeWidth}
        iconDelay={0}
        iconDuration={0.7}
        eyesDuration={eyesDuration}
        eyesDelay={0}
        textDelay={0}
        textDuration={0}
        instant={instant}
        eyeRadius={eyeRadius}
        onReady={() => {
          onReady?.();
        }}
      />
    </div>
  );
}

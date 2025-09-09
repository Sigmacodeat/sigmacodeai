import React from 'react';
import { Circle as CircleIcon, Loader2 as CircleDotsIcon } from 'lucide-react';

const CircleRender = ({ rmsLevel, isCameraOn, state }: { rmsLevel: number; isCameraOn: boolean; state?: string }) => {
  const baseScale = isCameraOn ? 0.5 : 1;
  const scaleMultiplier =
    rmsLevel > 0.08
      ? 1.8
      : rmsLevel > 0.07
        ? 1.6
        : rmsLevel > 0.05
          ? 1.4
          : rmsLevel > 0.01
            ? 1.2
            : 1;

  const transformScale = baseScale * scaleMultiplier;

  const getIconComponent = (state?: string) => {
    switch (state) {
      case 'Thinking':
        return <CircleDotsIcon className="animate-spin" size={24} />;
      default:
        return (
          <div className="smooth-transition" style={{ transform: `scale(${transformScale})` }}>
            <CircleIcon size={24} />
          </div>
        );
    }
  };

  return getIconComponent(state);
};

export default CircleRender;

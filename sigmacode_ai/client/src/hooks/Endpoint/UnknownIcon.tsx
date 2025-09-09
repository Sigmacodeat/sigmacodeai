import { memo } from 'react';
import { CustomMinimalIcon, XAIcon } from '@librechat/client';
import { EModelEndpoint, KnownEndpoints } from 'librechat-data-provider';
import { IconContext } from '~/common';
import { cn } from '~/utils';

// Provider-spezifische Asset-Mappings entfernt: wir verwenden bewusst generische Fallback-Icons,
// damit keine Abhängigkeit zu gelöschten /assets/* Dateien besteht.
const knownEndpointAssets: Record<string, string> = {};

const knownEndpointClasses = {
  [KnownEndpoints.cohere]: {
    [IconContext.landing]: 'p-2',
  },
  [KnownEndpoints.xai]: {
    [IconContext.landing]: 'p-2',
  },
};

const getKnownClass = ({
  currentEndpoint,
  context = '',
  className,
}: {
  currentEndpoint: string;
  context?: string;
  className: string;
}) => {
  if (currentEndpoint === KnownEndpoints.openrouter) {
    return className;
  }

  const match = knownEndpointClasses[currentEndpoint]?.[context] ?? '';
  const defaultClass = context === IconContext.landing ? '' : className;

  return cn(match, defaultClass);
};

function UnknownIcon({
  className = '',
  endpoint: _endpoint,
  iconURL = '',
  context,
}: {
  iconURL?: string;
  className?: string;
  endpoint?: EModelEndpoint | string | null;
  context?: 'landing' | 'menu-item' | 'nav' | 'message';
}) {
  const endpoint = _endpoint ?? '';
  if (!endpoint) {
    return <CustomMinimalIcon className={className} />;
  }

  const currentEndpoint = endpoint.toLowerCase();

  if (currentEndpoint === KnownEndpoints.xai) {
    return (
      <XAIcon
        className={getKnownClass({
          currentEndpoint,
          context: context,
          className,
        })}
      />
    );
  }

  if (iconURL) {
    return <img className={className} src={iconURL} alt={`${endpoint} Icon`} />;
  }

  const assetPath: string = knownEndpointAssets[currentEndpoint] ?? '';

  if (!assetPath) {
    return <CustomMinimalIcon className={className} />;
  }

  return (
    <img
      className={getKnownClass({
        currentEndpoint,
        context: context,
        className,
      })}
      src={assetPath}
      alt={`${currentEndpoint} Icon`}
    />
  );
}

export default memo(UnknownIcon);

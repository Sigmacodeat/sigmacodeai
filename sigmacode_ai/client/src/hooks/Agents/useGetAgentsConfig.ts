import { useMemo } from 'react';
import {
  EModelEndpoint,
  AgentCapabilities,
  defaultAgentCapabilities,
} from 'librechat-data-provider';
import type { TAgentsEndpoint, TEndpointsConfig, TConfig } from 'librechat-data-provider';
import { useGetEndpointsQuery } from '~/data-provider';

interface UseGetAgentsConfigOptions {
  endpointsConfig?: TEndpointsConfig;
}

export default function useGetAgentsConfig(options?: UseGetAgentsConfigOptions): {
  agentsConfig?: TAgentsEndpoint | null;
  endpointsConfig?: TEndpointsConfig | null;
} {
  const { endpointsConfig: providedConfig } = options || {};

  const { data: queriedConfig } = useGetEndpointsQuery({
    enabled: !providedConfig,
  });

  const endpointsConfig = providedConfig || queriedConfig;

  const agentsConfig = useMemo<TAgentsEndpoint | null>(() => {
    const config = endpointsConfig?.[EModelEndpoint.agents] ?? null;
    if (!config) return null;

    // Normalize and provide defaults to satisfy TAgentsEndpoint
    const cfg = config as TConfig;

    // Coerce capabilities to AgentCapabilities enum if provided; otherwise use library defaults
    const coercedCapabilities: AgentCapabilities[] = Array.isArray(cfg.capabilities)
      ? (cfg.capabilities.filter(Boolean) as unknown as AgentCapabilities[])
      : defaultAgentCapabilities;

    // Build a minimal, type-safe config with required fields and sensible defaults
    const normalized: TAgentsEndpoint = {
      disableBuilder: cfg.disableBuilder ?? false,
      capabilities: coercedCapabilities,
      maxCitations: (cfg as unknown as Partial<TAgentsEndpoint>).maxCitations ?? 30,
      maxCitationsPerFile:
        (cfg as unknown as Partial<TAgentsEndpoint>).maxCitationsPerFile ?? 7,
      minRelevanceScore:
        (cfg as unknown as Partial<TAgentsEndpoint>).minRelevanceScore ?? 0.45,
      // Optional compatible fields carried over when present
      baseURL: (cfg as unknown as Partial<TAgentsEndpoint>).baseURL,
      allowedProviders: (cfg as unknown as Partial<TAgentsEndpoint>).allowedProviders,
    };

    return normalized;
  }, [endpointsConfig]);

  return { agentsConfig, endpointsConfig };
}

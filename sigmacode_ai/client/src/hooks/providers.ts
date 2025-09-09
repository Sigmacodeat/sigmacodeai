import { useQuery } from '@tanstack/react-query';
import type { i18n } from 'i18next';
import { loadProvidersData } from '~/locales/providers/load';
import type { Provider } from '~/locales/providers/schema';
import { trackEvent } from '~/utils/analytics';

export function useProvidersList(i18nInstance: i18n) {
  return useQuery<Provider[]>({
    queryKey: ['providers:list', i18nInstance.language],
    queryFn: async () => {
      const data = await loadProvidersData(i18nInstance);
      return data.providers;
    },
    staleTime: 5 * 60 * 1000,
    onSuccess: (providers) => {
      trackEvent('providers.index.view', { locale: i18nInstance.language, count: providers?.length ?? 0 });
    },
    onError: (error: any) => {
      trackEvent('providers.index.error', { locale: i18nInstance.language, message: error?.message || String(error) });
    },
  });
}

export function useProviderDetail(slug: string | undefined, i18nInstance: i18n) {
  return useQuery<Provider | null>({
    queryKey: ['providers:detail', slug, i18nInstance.language],
    queryFn: async () => {
      if (!slug) return null;
      const data = await loadProvidersData(i18nInstance);
      const found = data.providers.find((p) => p.slug === slug);
      return found ?? null;
    },
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
    onSuccess: (provider) => {
      if (provider) {
        trackEvent('providers.detail.view', { slug: provider.slug, name: provider.name, locale: i18nInstance.language });
      } else {
        trackEvent('providers.detail.not_found', { slug, locale: i18nInstance.language });
      }
    },
    onError: (error: any) => {
      trackEvent('providers.detail.error', { slug, locale: i18nInstance.language, message: error?.message || String(error) });
    },
  });
}

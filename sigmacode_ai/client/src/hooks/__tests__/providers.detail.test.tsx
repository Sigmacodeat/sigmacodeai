import React from 'react';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { i18n } from 'i18next';
import { useProviderDetail } from '../providers';

jest.mock('~/locales/providers/load', () => ({
  loadProvidersData: jest.fn(),
}));

jest.mock('~/utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

const { loadProvidersData } = jest.requireMock('~/locales/providers/load');
const { trackEvent } = jest.requireMock('~/utils/analytics');

function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  });
}

function createWrapper() {
  const client = createClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

const i18nMock = { language: 'en' } as unknown as i18n;

describe('useProviderDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  test('returns provider and tracks view', async () => {
    loadProvidersData.mockResolvedValueOnce({ providers: [{ slug: 'openai', name: 'OpenAI' }] });

    const { result } = renderHook(() => useProviderDetail('openai', i18nMock), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ slug: 'openai', name: 'OpenAI' });
    await waitFor(() =>
      expect(trackEvent).toHaveBeenCalledWith('providers.detail.view', {
        slug: 'openai',
        name: 'OpenAI',
        locale: 'en',
      }),
    );
  });

  test('returns undefined and tracks not_found when provider is missing', async () => {
    loadProvidersData.mockResolvedValueOnce({ providers: [{ slug: 'anthropic', name: 'Anthropic' }] });

    const { result } = renderHook(() => useProviderDetail('openai', i18nMock), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeUndefined();
    await waitFor(() =>
      expect(trackEvent).toHaveBeenCalledWith('providers.detail.not_found', {
        slug: 'openai',
        locale: 'en',
      }),
    );
  });

  test('tracks error on failure', async () => {
    loadProvidersData.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useProviderDetail('openai', i18nMock), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(trackEvent).toHaveBeenCalledWith('providers.detail.error', {
        slug: 'openai',
        locale: 'en',
        message: 'boom',
      }),
    );
  });
});

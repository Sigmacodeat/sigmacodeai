import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient, withQueryClient } from '~/test/queryClient';
import { useProvidersList, useProviderDetail } from '~/hooks/providers';
import type { i18n } from 'i18next';

jest.mock('~/locales/providers/load', () => ({
  loadProvidersData: jest.fn(),
}));

jest.mock('~/utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

const { loadProvidersData } = require('~/locales/providers/load');

function createI18n(lang = 'en') {
  return { language: lang } as unknown as i18n;
}

describe('providers hooks', () => {
  it('useProvidersList returns providers on success', async () => {
    (loadProvidersData as any).mockResolvedValueOnce({ providers: [
      { slug: 'openai', name: 'OpenAI', models: [] },
    ] });
    const client = createTestQueryClient();
    const wrapper = withQueryClient(client);

    const { result } = renderHook(() => useProvidersList(createI18n('en')), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].slug).toBe('openai');
  });

  it('useProvidersList sets error when loader throws', async () => {
    (loadProvidersData as any).mockRejectedValueOnce(new Error('boom'));
    const client = createTestQueryClient();
    const wrapper = withQueryClient(client);

    const { result } = renderHook(() => useProvidersList(createI18n('de')), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe('boom');
  });

  it('useProviderDetail returns single provider when found', async () => {
    (loadProvidersData as any).mockResolvedValueOnce({ providers: [
      { slug: 'anthropic', name: 'Anthropic', models: [] },
    ] });
    const client = createTestQueryClient();
    const wrapper = withQueryClient(client);

    const { result } = renderHook(() => useProviderDetail('anthropic', createI18n('en')), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('Anthropic');
  });

  it('useProviderDetail yields undefined when not found', async () => {
    (loadProvidersData as any).mockResolvedValueOnce({ providers: [
      { slug: 'other', name: 'Other', models: [] },
    ] });
    const client = createTestQueryClient();
    const wrapper = withQueryClient(client);

    const { result } = renderHook(() => useProviderDetail('missing', createI18n('en')), { wrapper });

    await waitFor(() => expect(result.current.isFetched).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});

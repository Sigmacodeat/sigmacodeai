import { i18n } from 'i18next';
import { ProvidersFileSchema, type ProvidersFile } from './schema';

function normalizeLang(lang?: string) {
  if (!lang) return 'en';
  const base = lang.split('-')[0];
  return ['de', 'en'].includes(base) ? base : 'en';
}

export async function loadProvidersData(currentI18n?: i18n, overrideLang?: string): Promise<ProvidersFile> {
  const lang = normalizeLang(overrideLang || currentI18n?.language);
  try {
    const data = await (lang === 'de'
      ? import('./de/providers.json')
      : import('./en/providers.json'));
    const parsed = ProvidersFileSchema.safeParse(data.default ?? data);
    if (!parsed.success) {
      console.error('Provider data validation failed', parsed.error);
      throw parsed.error;
    }
    return parsed.data;
  } catch (e) {
    // Fallback EN
    const data = await import('./en/providers.json');
    const parsed = ProvidersFileSchema.safeParse(data.default ?? data);
    if (!parsed.success) {
      console.error('Provider EN fallback validation failed', parsed.error);
      throw parsed.error;
    }
    return parsed.data;
  }
}

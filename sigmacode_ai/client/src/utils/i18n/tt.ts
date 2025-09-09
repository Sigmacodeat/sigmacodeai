// Small helper to always return a string from i18next
// Usage: tt(t)('key', 'Default')
import type { TFunction } from 'i18next';

export const tt = (t: TFunction) => (key: string, defaultValue?: string): string => {
  const val = t(key, defaultValue as any);
  return typeof val === 'string' ? val : String(val);
};

export default tt;

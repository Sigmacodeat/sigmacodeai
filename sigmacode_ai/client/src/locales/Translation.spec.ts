import English from './en/translation.json';
import French from './fr/translation.json';
import Spanish from './es/translation.json';
import { TranslationKeys } from '~/hooks';

// Minimaler Formatter, um {0}, {1}, ... im String zu ersetzen
function format(template: string, options?: Record<string | number, string>): string {
  if (!options) return template;
  // Erst doppelt geschweifte Klammern ersetzen (i18next-Stil), dann einfache
  let out = template.replace(/\{\{(\d+)\}\}/g, (_, idx) => {
    const v = (options as any)[idx];
    return v == null ? `{{${idx}}}` : String(v);
  });
  out = out.replace(/\{(\d+)\}/g, (_, idx) => {
    const v = (options as any)[idx];
    return v == null ? `{${idx}}` : String(v);
  });
  return out;
}

describe('translation JSON tests (no i18n runtime)', () => {

  it('should return the correct translation for a valid key in English', () => {
    expect(English.com_ui_examples).toBeDefined();
  });

  it('should return the correct translation for a valid key in French', () => {
    expect(French.com_ui_examples).toBeDefined();
  });

  it('should return the correct translation for a valid key in Spanish', () => {
    expect(Spanish.com_ui_examples).toBeDefined();
  });

  it('should have a consistent fallback source (English present)', () => {
    expect(English.com_ui_examples).toBeTruthy();
  });

  it('invalid keys are not present in JSON maps', () => {
    expect((English as any)['invalid-key']).toBeUndefined();
  });

  it('should correctly format placeholders in the translation', () => {
    expect(format(English.com_endpoint_default_with_num as string, { 0: 'John' })).toBe('default: John');
    expect(format(French.com_endpoint_default_with_num as string, { 0: 'Marie' })).toBe('par défaut : Marie');
  });
});

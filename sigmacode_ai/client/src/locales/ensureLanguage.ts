// Test-sicherer Proxy für ensureLanguage:
// In Jest-Umgebung NICHT die ESM-Datei './i18n' importieren (verwendet import.meta.glob).
// Stattdessen No-Op; in allen anderen Umgebungen dynamisch auf die echte Implementierung delegieren.

export async function ensureLanguage(lng: string): Promise<void> {
  if (typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID) {
    // In Tests: No-Op, Übersetzungen kommen aus Mocks/Shim
    return;
  }
  // Laufzeit-Import nur außerhalb von Tests
  const mod = await import('./i18n');
  return (mod as any).ensureLanguage(lng);
}

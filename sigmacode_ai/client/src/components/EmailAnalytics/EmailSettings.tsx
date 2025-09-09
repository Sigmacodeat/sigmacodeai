import { useDevEmailBackfill, useDevEmailRefresh } from '@/hooks/api/devemail';
import { EmailNavTabs } from './EmailNavTabs';

export function EmailSettings() {
  const refresh = useDevEmailRefresh();
  const backfill = useDevEmailBackfill();

  return (
    <div>
      <EmailNavTabs active="settings" />
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">Email Settings</h1>
      <div className="space-x-2">
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={() => refresh.mutate()}
          disabled={refresh.isLoading}
        >
          Refresh
        </button>
        <button
          className="px-3 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
          onClick={() => backfill.mutate()}
          disabled={backfill.isLoading}
        >
          Backfill
        </button>
      </div>
      {(refresh.isError || backfill.isError) && (
        <div className="text-red-600">Aktion fehlgeschlagen. Bitte erneut versuchen.</div>
      )}
      {(refresh.isSuccess || backfill.isSuccess) && (
        <div className="text-green-600">Aktion erfolgreich ausgeführt.</div>
      )}
      <div className="text-sm text-gray-600">
        Hinweis: Im DEV-Modus ist ggf. ein Admin-Token via <code>VITE_DEV_EMAIL_ADMIN_TOKEN</code> erforderlich.
      </div>
      </div>
    </div>
  );
}

export default EmailSettings;

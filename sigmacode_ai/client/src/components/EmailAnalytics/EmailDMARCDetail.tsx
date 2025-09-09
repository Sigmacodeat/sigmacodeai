import { useParams } from 'react-router-dom';
import { useDevEmailDMARCReport } from '@/hooks/api/devemail';
import { EmailNavTabs } from './EmailNavTabs';

export function EmailDMARCDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useDevEmailDMARCReport(id);

  if (!id) return (
    <div>
      <EmailNavTabs active="dmarc" />
      <div className="p-4">Ungültige ID</div>
    </div>
  );
  if (isLoading) return (
    <div>
      <EmailNavTabs active="dmarc" />
      <div className="p-4">Lade DMARC-Report…</div>
    </div>
  );
  if (error) return (
    <div>
      <EmailNavTabs active="dmarc" />
      <div className="p-4">
        <div className="text-red-600 mb-2">Fehler beim Laden</div>
        <button className="btn btn-sm" onClick={() => refetch()}>Erneut versuchen</button>
      </div>
    </div>
  );

  if (!data) return (
    <div>
      <EmailNavTabs active="dmarc" />
      <div className="p-4">Keine Daten</div>
    </div>
  );

  const records = data.records ?? [];

  return (
    <div>
      <EmailNavTabs active="dmarc" />
      <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">DMARC Report</h1>
        <div className="text-sm text-gray-600">{data.domain} · {data.dateRange.from} → {data.dateRange.to}</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded border bg-white">
          <div className="text-xs text-gray-500">Pass</div>
          <div className="text-xl font-semibold">{data.passCount ?? '-'}</div>
        </div>
        <div className="p-3 rounded border bg-white">
          <div className="text-xs text-gray-500">Fail</div>
          <div className="text-xl font-semibold">{data.failCount ?? '-'}</div>
        </div>
        <div className="p-3 rounded border bg-white">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-xl font-semibold">{data.totalCount ?? '-'}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Source IP</th>
              <th className="py-2 pr-4">Count</th>
              <th className="py-2 pr-4">DKIM</th>
              <th className="py-2 pr-4">SPF</th>
              <th className="py-2 pr-4">Disposition</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, idx) => (
              <tr key={`${r.sourceIp}-${idx}`} className="border-b hover:bg-gray-50">
                <td className="py-2 pr-4">{r.sourceIp}</td>
                <td className="py-2 pr-4">{r.count}</td>
                <td className="py-2 pr-4">{r.dkim ?? '-'}</td>
                <td className="py-2 pr-4">{r.spf ?? '-'}</td>
                <td className="py-2 pr-4">{r.disposition ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}

export default EmailDMARCDetail;

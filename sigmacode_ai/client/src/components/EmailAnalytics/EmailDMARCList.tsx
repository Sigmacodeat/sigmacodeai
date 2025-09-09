import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useDevEmailDMARCReports } from '@/hooks/api/devemail';
import { EmailNavTabs } from './EmailNavTabs';

export function EmailDMARCList() {
  const { data, isLoading, error, refetch } = useDevEmailDMARCReports({ page: 1, pageSize: 200 });

  // Filters & UI state
  const [domain, setDomain] = useState<string>('');
  const [onlyFails, setOnlyFails] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  if (isLoading) return (
    <div>
      <EmailNavTabs active="dmarc" />
      <div className="p-4">Lade DMARC-Reports…</div>
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

  const items = data?.items ?? [];

  const filtered = useMemo(() => {
    const dom = domain.trim().toLowerCase();
    return items
      .filter((r) => {
        if (dom && !r.domain.toLowerCase().includes(dom)) return false;
        if (onlyFails) {
          const fail = r.failCount ?? 0;
          return fail > 0;
        }
        return true;
      })
      .sort((a, b) => new Date(b.dateRange.to).getTime() - new Date(a.dateRange.to).getTime());
  }, [items, domain, onlyFails]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <EmailNavTabs active="dmarc" />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-semibold">DMARC Reports</h1>
          <div className="flex items-end gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Domain</label>
              <input
                value={domain}
                onChange={(e) => { setDomain(e.target.value); setPage(1); }}
                placeholder="example.com"
                className="px-3 py-2 rounded-md bg-gray-50 border text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={onlyFails} onChange={(e) => { setOnlyFails(e.target.checked); setPage(1); }} />
              only fails
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Domain</th>
                <th className="py-2 pr-4">Zeitraum</th>
                <th className="py-2 pr-4">Pass</th>
                <th className="py-2 pr-4">Fail</th>
                <th className="py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">
                    <Link to={`/d/email/dmarc/${encodeURIComponent(r.id)}`} className="text-blue-600 hover:underline">
                      {r.domain}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{r.dateRange.from} → {r.dateRange.to}</td>
                  <td className="py-2 pr-4">{r.passCount ?? '-'}</td>
                  <td className="py-2 pr-4">{r.failCount ?? '-'}</td>
                  <td className="py-2 pr-4">{r.totalCount ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between text-sm">
          <span>
            {filtered.length === 0 ? 'No results' : `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-md bg-gray-100 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span>Page {page} / {totalPages}</span>
            <button
              className="px-3 py-2 rounded-md bg-gray-100 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailDMARCList;

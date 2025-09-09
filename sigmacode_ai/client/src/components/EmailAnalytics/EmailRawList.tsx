import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useDevEmailRawList } from '@/hooks/api/devemail';
import { EmailNavTabs } from './EmailNavTabs';

export function EmailRawList() {
  const { data, isLoading, error, refetch } = useDevEmailRawList({ page: 1, pageSize: 200 });

  // Filters & UI state
  const [query, setQuery] = useState<string>('');
  const [days, setDays] = useState<7 | 30>(7);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  if (isLoading) return (
    <div>
      <EmailNavTabs active="raw" />
      <div className="p-4">Lade E-Mails…</div>
    </div>
  );
  if (error) return (
    <div>
      <EmailNavTabs active="raw" />
      <div className="p-4">
        <div className="text-red-600 mb-2">Fehler beim Laden</div>
        <button className="btn btn-sm" onClick={() => refetch()}>Erneut versuchen</button>
      </div>
    </div>
  );

  const items = data?.items ?? [];

  const now = useMemo(() => new Date(), []);
  const fromDate = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  }, [now, days]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items
      .filter((e) => {
        const d = new Date(e.date);
        const inRange = d >= fromDate && d <= now;
        if (!inRange) return false;
        if (!q) return true;
        return (
          (e.subject || '').toLowerCase().includes(q) ||
          (e.from || '').toLowerCase().includes(q) ||
          (e.to || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [items, query, fromDate, now]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <EmailNavTabs active="raw" />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-semibold">Raw Emails</h1>
          <div className="flex items-end gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Search</label>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="subject, from, to"
                className="px-3 py-2 rounded-md bg-gray-50 border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Timeframe</label>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-2 rounded-md text-sm ${days === 7 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
                  onClick={() => { setDays(7); setPage(1); }}
                >
                  7d
                </button>
                <button
                  className={`px-3 py-2 rounded-md text-sm ${days === 30 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
                  onClick={() => { setDays(30); setPage(1); }}
                >
                  30d
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Betreff</th>
                <th className="py-2 pr-4">Von</th>
                <th className="py-2 pr-4">An</th>
                <th className="py-2 pr-4">Datum</th>
                <th className="py-2 pr-4">Anhänge</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((e) => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">
                    <Link to={`/d/email/raw/${encodeURIComponent(e.id)}`} className="text-blue-600 hover:underline">
                      {e.subject || '(kein Betreff)'}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{e.from}</td>
                  <td className="py-2 pr-4">{e.to}</td>
                  <td className="py-2 pr-4">{new Date(e.date).toLocaleString()}</td>
                  <td className="py-2 pr-4">{e.attachments?.length ?? 0}</td>
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

export default EmailRawList;

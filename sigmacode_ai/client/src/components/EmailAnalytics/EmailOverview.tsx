import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import EmailNavTabs from './EmailNavTabs';
import { useDevEmailBackfill, useDevEmailDMARCReports, useDevEmailRawList, useDevEmailRefresh } from '@/hooks/api/devemail';
import { computeDmarcTotals, groupRawByDay, topSender, barScale, groupDmarcByDay, passFailScale } from '@/utils/emailAnalytics/aggregation';

export function EmailOverview() {
  const { data: rawList, isLoading: rawLoading, error: rawError } = useDevEmailRawList();
  const { data: dmarcList, isLoading: dmarcLoading, error: dmarcError } = useDevEmailDMARCReports();
  const refresh = useDevEmailRefresh();
  const backfill = useDevEmailBackfill();

  // Client-seitige Filter (Zeitraum, Domain)
  const [days, setDays] = useState<7 | 30>(7);
  const [domainFilter, setDomainFilter] = useState<string>('');

  const now = useMemo(() => new Date(), []);
  const fromDate = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  }, [now, days]);

  const filteredRaw = useMemo(() => {
    const items = rawList?.items ?? [];
    return items.filter((i) => {
      const d = new Date(i.date);
      const inRange = d >= fromDate && d <= now;
      return inRange;
    });
  }, [rawList, fromDate, now]);

  const filteredDMARC = useMemo(() => {
    const items = dmarcList?.items ?? [];
    return items.filter((r) => {
      if (domainFilter && r.domain !== domainFilter) return false;
      return true;
    });
  }, [dmarcList, domainFilter]);

  const recentRaw = filteredRaw.slice(0, 5);
  const recentDMARC = filteredDMARC.slice(0, 5);

  // KPIs & Trends
  const dmarcTotals = computeDmarcTotals(filteredDMARC);
  const rawBuckets = groupRawByDay(filteredRaw);
  const scaled = barScale(rawBuckets);
  const top = topSender(filteredRaw);
  const dmarcDayBuckets = groupDmarcByDay(filteredDMARC);
  const pfScaled = passFailScale(dmarcDayBuckets);

  return (
    <div className="flex flex-col h-full">
      <EmailNavTabs active="overview" />
      <div className="p-4 space-y-6">
        {/* Filter */}
        <section className="rounded-lg border p-4 bg-white flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Timeframe</label>
            <div className="flex gap-2">
              <button
                className={`px-3 py-2 rounded-md text-sm ${days === 7 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
                onClick={() => setDays(7)}
              >
                7d
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm ${days === 30 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
                onClick={() => setDays(30)}
              >
                30d
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Domain</label>
            <input
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value.trim())}
              placeholder="example.com"
              className="px-3 py-2 rounded-md bg-gray-50 border text-sm"
            />
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 bg-white">
            <p className="text-xs text-gray-500">DMARC Pass-Rate</p>
            <p className="text-2xl font-semibold">{dmarcTotals.passRate}%</p>
            <p className="text-xs text-gray-500">Total: {dmarcTotals.total} · Pass: {dmarcTotals.pass} · Fail: {dmarcTotals.fail}</p>
          </div>
          <div className="rounded-lg border p-4 bg-white">
            <p className="text-xs text-gray-500">Email Volume ({days}d)</p>
            <p className="text-2xl font-semibold">{filteredRaw.length}</p>
            <p className="text-xs text-gray-500">Distinct Days: {rawBuckets.length}</p>
          </div>
          <div className="rounded-lg border p-4 bg-white">
            <p className="text-xs text-gray-500">Top Sender</p>
            <p className="text-2xl font-semibold">{top?.sender ?? '—'}</p>
            <p className="text-xs text-gray-500">Count: {top?.count ?? 0}</p>
          </div>
        </section>

        {/* Trend (simple bars) */}
        <section className="rounded-lg border p-4 bg-white">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Volume Trend (per Day)</h2>
          {scaled.length === 0 ? (
            <p className="text-sm text-gray-500">No data</p>
          ) : (
            <ul className="space-y-2">
              {scaled.map((b) => (
                <li key={b.date} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-gray-600">{b.date}</span>
                  <div className="flex-1 bg-gray-100 h-3 rounded">
                    <div className="bg-gray-900 h-3 rounded" style={{ width: `${b.widthPct}%` }} />
                  </div>
                  <span className="w-8 text-xs text-gray-700 text-right">{b.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* DMARC Pass/Fail Trend (stacked bars) */}
        <section className="rounded-lg border p-4 bg-white">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">DMARC Pass/Fail Trend</h2>
          {pfScaled.length === 0 ? (
            <p className="text-sm text-gray-500">No data</p>
          ) : (
            <ul className="space-y-2">
              {pfScaled.map((b) => (
                <li key={b.date} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-gray-600">{b.date}</span>
                  <div className="flex-1 bg-gray-100 h-3 rounded overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-3"
                      style={{ width: `${b.passWidthPct}%` }}
                      title={`pass ${b.pass}`}
                    />
                    <div
                      className="bg-rose-500 h-3"
                      style={{ width: `${b.failWidthPct}%` }}
                      title={`fail ${b.fail}`}
                    />
                  </div>
                  <span className="w-16 text-xs text-gray-700 text-right">{b.pass}/{b.fail}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Data Refresh</h2>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded-md bg-gray-900 text-white text-sm disabled:opacity-50"
                  onClick={() => refresh.mutate()}
                  disabled={refresh.isLoading}
                >
                  {refresh.isLoading ? 'Refreshing…' : 'Refresh'}
                </button>
                <button
                  className="px-3 py-2 rounded-md bg-gray-100 text-gray-900 text-sm disabled:opacity-50"
                  onClick={() => backfill.mutate()}
                  disabled={backfill.isLoading}
                >
                  {backfill.isLoading ? 'Backfilling…' : 'Backfill'}
                </button>
              </div>
            </div>
            {(refresh.isError || backfill.isError) && (
              <p className="text-sm text-red-600 mt-2">Action failed. Please check server logs.</p>
            )}
            {(refresh.isSuccess || backfill.isSuccess) && (
              <p className="text-sm text-green-700 mt-2">Action triggered successfully.</p>
            )}
          </div>

          <div className="rounded-lg border p-4 bg-white">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Quick Links</h2>
            <div className="flex flex-wrap gap-2">
              <Link className="px-3 py-2 rounded-md bg-gray-100 text-sm" to="/d/email/raw">View Raw</Link>
              <Link className="px-3 py-2 rounded-md bg-gray-100 text-sm" to="/d/email/dmarc">View DMARC</Link>
              <Link className="px-3 py-2 rounded-md bg-gray-100 text-sm" to="/d/email/settings">Settings</Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Recent Raw Emails</h3>
              <Link className="text-sm text-blue-600" to="/d/email/raw">All</Link>
            </div>
            {rawLoading && <p className="text-sm text-gray-500">Loading…</p>}
            {Boolean(rawError) && <p className="text-sm text-red-600">Failed to load raw emails.</p>}
            {!rawLoading && !rawError && (
              <ul className="divide-y">
                {recentRaw.map((item: any) => (
                  <li key={item.id} className="py-2 text-sm flex justify-between gap-4">
                    <span className="truncate">{item.subject || item.id}</span>
                    <Link className="text-blue-600 shrink-0" to={`/d/email/raw/${encodeURIComponent(item.id)}`}>Open</Link>
                  </li>
                ))}
                {recentRaw.length === 0 && <li className="py-2 text-sm text-gray-500">No data</li>}
              </ul>
            )}
          </div>

          <div className="rounded-lg border p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Recent DMARC Reports</h3>
              <Link className="text-sm text-blue-600" to="/d/email/dmarc">All</Link>
            </div>
            {dmarcLoading && <p className="text-sm text-gray-500">Loading…</p>}
            {Boolean(dmarcError) && <p className="text-sm text-red-600">Failed to load DMARC reports.</p>}
            {!dmarcLoading && !dmarcError && (
              <ul className="divide-y">
                {recentDMARC.map((item: any) => (
                  <li key={item.id} className="py-2 text-sm flex justify-between gap-4">
                    <span className="truncate">{item.subject || item.reportId || item.id}</span>
                    <Link className="text-blue-600 shrink-0" to={`/d/email/dmarc/${encodeURIComponent(item.id)}`}>Open</Link>
                  </li>
                ))}
                {recentDMARC.length === 0 && <li className="py-2 text-sm text-gray-500">No data</li>}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default EmailOverview;

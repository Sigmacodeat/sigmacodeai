import { DMARCReport, RawEmail } from '@/types/devemail';

export type TimeBucket = { date: string; count: number };

export function computeDmarcTotals(reports: DMARCReport[] = []) {
  let pass = 0;
  let fail = 0;
  let total = 0;
  for (const r of reports) {
    if (typeof r.passCount === 'number') pass += r.passCount;
    if (typeof r.failCount === 'number') fail += r.failCount;
    if (typeof r.totalCount === 'number') total += r.totalCount;
    else total += (r.passCount ?? 0) + (r.failCount ?? 0);
  }
  const passRate = total > 0 ? Math.round((pass / total) * 100) : 0;
  return { pass, fail, total, passRate };
}

export function groupRawByDay(items: RawEmail[] = []): TimeBucket[] {
  const map = new Map<string, number>();
  for (const i of items) {
    const d = new Date(i.date);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function topSender(items: RawEmail[] = []): { sender: string; count: number } | null {
  const map = new Map<string, number>();
  for (const i of items) {
    const key = i.from || 'unknown';
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  let best: { sender: string; count: number } | null = null;
  for (const [sender, count] of map.entries()) {
    if (!best || count > best.count) best = { sender, count };
  }
  return best;
}

export function barScale(buckets: TimeBucket[], maxBars = 20) {
  const max = Math.max(1, ...buckets.map((b) => b.count));
  return buckets.map((b) => ({ ...b, widthPct: Math.round((b.count / max) * 100) }));
}

// DMARC per-day aggregation
export type DmarcDayBucket = { date: string; pass: number; fail: number; total: number };

export function groupDmarcByDay(reports: DMARCReport[] = []): DmarcDayBucket[] {
  const map = new Map<string, { pass: number; fail: number; total: number }>();
  for (const r of reports) {
    // Use end date of the report window as bucket label
    const d = new Date(r.dateRange?.to ?? Date.now());
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    const pass = r.passCount ?? 0;
    const fail = r.failCount ?? 0;
    const total = typeof r.totalCount === 'number' ? r.totalCount : pass + fail;
    const cur = map.get(key) ?? { pass: 0, fail: 0, total: 0 };
    map.set(key, { pass: cur.pass + pass, fail: cur.fail + fail, total: cur.total + total });
  }
  return Array.from(map.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function passFailScale(buckets: DmarcDayBucket[]) {
  const max = Math.max(1, ...buckets.map((b) => b.total));
  return buckets.map((b) => ({
    ...b,
    passWidthPct: Math.round(((b.pass || 0) / max) * 100),
    failWidthPct: Math.round(((b.fail || 0) / max) * 100),
  }));
}

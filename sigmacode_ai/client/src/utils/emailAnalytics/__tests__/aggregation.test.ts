import { computeDmarcTotals, groupRawByDay, topSender, barScale, groupDmarcByDay, passFailScale } from '../../emailAnalytics/aggregation';
import type { DMARCReport, RawEmail } from '@/types/devemail';

function d(date: string) {
  return new Date(date).toISOString();
}

describe('emailAnalytics/aggregation', () => {
  test('computeDmarcTotals aggregates pass/fail/total and passRate', () => {
    const reports: DMARCReport[] = [
      {
        id: 'r1',
        domain: 'example.com',
        dateRange: { from: '2025-08-01', to: '2025-08-01' },
        passCount: 80,
        failCount: 20,
        totalCount: 100,
        records: [],
      },
      {
        id: 'r2',
        domain: 'example.com',
        dateRange: { from: '2025-08-02', to: '2025-08-02' },
        passCount: 50,
        failCount: 50,
        // totalCount omitted -> derived
        records: [],
      } as unknown as DMARCReport,
    ];

    const res = computeDmarcTotals(reports);
    expect(res.pass).toBe(130);
    expect(res.fail).toBe(70);
    expect(res.total).toBe(200);
    expect(res.passRate).toBe(65);
  });

  test('groupRawByDay groups and sorts by day', () => {
    const items: RawEmail[] = [
      { id: 'a', subject: 'S', from: 'x', to: 'y', date: d('2025-08-01T10:00:00Z'), parsed: false, hasAttachments: false, attachments: [] },
      { id: 'b', subject: 'S', from: 'x', to: 'y', date: d('2025-08-01T12:00:00Z'), parsed: false, hasAttachments: false, attachments: [] },
      { id: 'c', subject: 'S', from: 'x', to: 'y', date: d('2025-08-02T08:00:00Z'), parsed: false, hasAttachments: false, attachments: [] },
    ];
    const buckets = groupRawByDay(items);
    expect(buckets).toEqual([
      { date: '2025-08-01', count: 2 },
      { date: '2025-08-02', count: 1 },
    ]);
  });

  test('topSender returns most frequent sender', () => {
    const items: RawEmail[] = [
      { id: 'a', subject: 'S', from: 'alice@example.com', to: 'y', date: d('2025-08-01T10:00:00Z'), parsed: false, hasAttachments: false, attachments: [] },
      { id: 'b', subject: 'S', from: 'bob@example.com', to: 'y', date: d('2025-08-01T12:00:00Z'), parsed: false, hasAttachments: false, attachments: [] },
      { id: 'c', subject: 'S', from: 'alice@example.com', to: 'y', date: d('2025-08-02T08:00:00Z'), parsed: false, hasAttachments: false, attachments: [] },
    ];
    expect(topSender(items)).toEqual({ sender: 'alice@example.com', count: 2 });
  });

  test('barScale returns widthPct relative to max', () => {
    const buckets = [
      { date: '2025-08-01', count: 1 },
      { date: '2025-08-02', count: 4 },
    ];
    const scaled = barScale(buckets);
    const max = scaled.find((b) => b.date === '2025-08-02');
    expect(max?.widthPct).toBe(100);
  });

  test('groupDmarcByDay aggregates by dateRange.to and sorts', () => {
    const reports: DMARCReport[] = [
      { id: 'r1', domain: 'ex.com', dateRange: { from: '2025-08-01', to: '2025-08-01' }, passCount: 10, failCount: 5, totalCount: 15, records: [] },
      { id: 'r2', domain: 'ex.com', dateRange: { from: '2025-08-01', to: '2025-08-01' }, passCount: 5, failCount: 5, totalCount: 10, records: [] },
      { id: 'r3', domain: 'ex.com', dateRange: { from: '2025-08-02', to: '2025-08-02' }, passCount: 2, failCount: 1, totalCount: 3, records: [] },
    ];
    const day = groupDmarcByDay(reports);
    expect(day).toEqual([
      { date: '2025-08-01', pass: 15, fail: 10, total: 25 },
      { date: '2025-08-02', pass: 2, fail: 1, total: 3 },
    ]);
  });

  test('passFailScale maps widths based on total', () => {
    const buckets = [
      { date: '2025-08-01', pass: 10, fail: 10, total: 20 },
      { date: '2025-08-02', pass: 5, fail: 5, total: 10 },
    ];
    const scaled = passFailScale(buckets);
    expect(scaled[0].passWidthPct + scaled[0].failWidthPct).toBeLessThanOrEqual(100);
    const max = scaled[0];
    expect(max.passWidthPct).toBeGreaterThan(scaled[1].passWidthPct);
  });
});

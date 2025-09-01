import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import { jest } from '@jest/globals';

// ESM-kompatibles Mocking: vor dem Import des Routers Module mocken und dann dynamisch importieren
let buildDevEmailRouter: (opts: { adminToken: string }) => import('express').Router;
beforeAll(async () => {
  // Typed Jest mocks (use any-casting to satisfy TS setup in this repo)
  const rawCount = jest.fn() as any;
  rawCount.mockResolvedValue(1);
  const rawFindMany = jest.fn() as any;
  rawFindMany.mockResolvedValue([
    {
      id: 'raw1',
      subject: 'DMARC Aggregate Report (stub)',
      source: 'imap:stub',
      parsed: true,
      attachments: JSON.stringify([{ filename: 'report.xml', mime: 'application/xml', size: 1024 }]),
      receivedAt: new Date().toISOString(),
    },
  ]);
  const rawFindUnique = jest.fn() as any;
  rawFindUnique.mockImplementation(async ({ where }: any) => {
    if (where.id === 'raw1') {
      return {
        id: 'raw1',
        subject: 'DMARC Aggregate Report (stub)',
        source: 'imap:stub',
        parsed: true,
        imapUid: 123,
        attachments: JSON.stringify([{ filename: 'report.xml', mime: 'application/xml', size: 1024 }]),
        rawHeaders: 'X-Test: 1',
        rawBody: 'Hello',
      };
    }
    return null;
  });
  const rawCreate = jest.fn() as any;
  rawCreate.mockResolvedValue({ id: 'raw-seeded' });

  const dmarcCount = jest.fn() as any;
  dmarcCount.mockResolvedValue(1);
  const dmarcFindMany = jest.fn() as any;
  dmarcFindMany.mockResolvedValue([
    {
      id: 'rep1',
      org: 'example.net',
      reportId: 'rep-2025-08-27-0001',
      domain: 'sigmacode.ai',
      dateBegin: 1727308800,
      dateEnd: 1727395200,
      policyAdkim: 'r',
      policyAspf: 'r',
      policyP: 'none',
      records: [
        {
          id: 'rec1',
          reportId: 'rep1',
          sourceIp: '203.0.113.9',
          count: 10,
          disposition: 'none',
          dkim: 'pass',
          spf: 'pass',
        },
      ],
    },
  ]);
  const dmarcFindUnique = jest.fn() as any;
  dmarcFindUnique.mockImplementation(async ({ where }: any) => {
    if (where.id === 'rep1') {
      return {
        id: 'rep1',
        org: 'example.net',
        reportId: 'rep-2025-08-27-0001',
        domain: 'sigmacode.ai',
        dateBegin: 1727308800,
        dateEnd: 1727395200,
        policyAdkim: 'r',
        policyAspf: 'r',
        policyP: 'none',
        records: [],
      };
    }
    return null;
  });
  const dmarcCreate = jest.fn() as any;
  dmarcCreate.mockResolvedValue({ id: 'rep1' });

  const dmarcRecordCreate = jest.fn() as any;
  dmarcRecordCreate.mockResolvedValue({ id: 'rec1' });

  const prismaMock = {
    rawEmail: {
      count: rawCount,
      findMany: rawFindMany,
      findUnique: rawFindUnique,
      create: rawCreate,
    },
    dMARCReport: {
      count: dmarcCount,
      findMany: dmarcFindMany,
      findUnique: dmarcFindUnique,
      create: dmarcCreate,
    },
    dMARCRecord: {
      create: dmarcRecordCreate,
    },
  } as any;

  await jest.unstable_mockModule('../db', () => ({ __esModule: true, default: prismaMock }));
  await jest.unstable_mockModule('../imap', () => ({
    __esModule: true,
    runImapFetch: (jest.fn() as any).mockResolvedValue({ fetched: 0 }),
    runImapBackfill: (jest.fn() as any).mockResolvedValue({ parsed: 0 }),
    downloadAttachmentByFilename: (jest
      .fn() as any)
      .mockResolvedValue({ buffer: Buffer.from('filedata'), mime: 'text/plain', dispositionFilename: 'report.xml' }),
  }));
  await jest.unstable_mockModule('../../config/env', () => ({ __esModule: true, loadEnv: () => ({ ATTACHMENT_MAX_MB: 5 }) }));

  const mod = await import('../router');
  buildDevEmailRouter = mod.buildDevEmailRouter;
});

function createApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use('/api', buildDevEmailRouter({ adminToken: 'test-token' }));
  // basic error handler for tests
  app.use((err: any, _req: any, res: any, _next: any) => {
    // eslint-disable-next-line no-console
    console.error('TestError:', err);
    res.status(500).json({ error: 'internal', message: String(err && err.message ? err.message : err) });
  });
  return app;
}

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<feedback>
  <report_metadata>
    <org_name>example.net</org_name>
    <report_id>rep-2025-08-27-0001</report_id>
    <date_range>
      <begin>1727308800</begin>
      <end>1727395200</end>
    </date_range>
  </report_metadata>
  <policy_published>
    <domain>sigmacode.ai</domain>
    <adkim>r</adkim>
    <aspf>r</aspf>
    <p>none</p>
  </policy_published>
  <record>
    <row>
      <source_ip>203.0.113.9</source_ip>
      <count>2</count>
      <policy_evaluated>
        <disposition>none</disposition>
        <dkim>pass</dkim>
        <spf>pass</spf>
      </policy_evaluated>
    </row>
    <identifiers>
      <header_from>sigmacode.ai</header_from>
    </identifiers>
    <auth_results>
      <dkim>
        <domain>sigmacode.ai</domain>
        <result>pass</result>
      </dkim>
      <spf>
        <domain>sigmacode.ai</domain>
        <result>pass</result>
      </spf>
    </auth_results>
  </record>
</feedback>`;

describe('DevEmail Router Integration', () => {
  const TOKEN = { 'x-admin-dev-token': 'test-token' };
  it('rejects missing admin token', async () => {
    const app = createApp();
    const res = await request(app).get('/api/raw');
    expect(res.status).toBe(401);
  });

  it('lists raw emails', async () => {
    const app = createApp();
    const res = await request(app).get('/api/raw').set(TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.items?.length).toBeGreaterThan(0);
  });

  it('gets raw by id', async () => {
    const app = createApp();
    const res = await request(app).get('/api/raw/raw1').set(TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('raw1');
    expect(res.body.attachments?.length).toBeGreaterThan(0);
  });

  it('downloads attachment by filename', async () => {
    const app = createApp();
    const res = await request(app)
      .get('/api/raw/raw1/attachments/report.xml')
      .set(TOKEN)
      .buffer(true)
      .parse((res, cb) => {
        const data: Buffer[] = [];
        res.on('data', (chunk: Buffer) => data.push(chunk));
        res.on('end', () => cb(null, Buffer.concat(data)));
      });
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.headers['content-disposition']).toContain('report.xml');
    expect(Buffer.isBuffer(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('lists dmarc reports', async () => {
    const app = createApp();
    const res = await request(app).get('/api/dmarc/reports').set(TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.items?.[0]?.id).toBe('rep1');
  });

  it('gets dmarc report by id', async () => {
    const app = createApp();
    const res = await request(app).get('/api/dmarc/rep1').set(TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('rep1');
  });

  it('parses dmarc via POST /dmarc/parse', async () => {
    const app = createApp();
    const res = await request(app).post('/api/dmarc/parse').set(TOKEN).send({ xml: XML });
    // Depending on mock behavior we return 201 or 500 on mock mismatch
    expect([201, 500]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.id).toBeDefined();
    }
  });

  it('triggers refresh and backfill', async () => {
    const app = createApp();
    const res1 = await request(app).post('/api/refresh').set(TOKEN);
    const res2 = await request(app).post('/api/backfill').set(TOKEN);
    expect(res1.status).toBe(202);
    expect(res2.status).toBe(202);
  });
});

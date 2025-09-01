import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import prisma from './db';

// Zod-Schemas für minimal tragfähiges DMARC Aggregate Parsing
const ReportMetadataSchema = z.object({
  org_name: z.string().optional(),
  email: z.string().optional(),
  report_id: z.string().optional(),
  date_range: z
    .object({ begin: z.coerce.number().optional(), end: z.coerce.number().optional() })
    .optional(),
});

const PolicyPublishedSchema = z.object({
  domain: z.string().optional(),
  adkim: z.string().optional(),
  aspf: z.string().optional(),
  p: z.string().optional(),
});

const RowSchema = z.object({
  source_ip: z.string().optional(),
  count: z.coerce.number().optional(),
  policy_evaluated: z
    .object({ disposition: z.string().optional(), dkim: z.string().optional(), spf: z.string().optional() })
    .optional(),
});

const IdentifiersSchema = z.object({ header_from: z.string().optional() });

const AuthResultsSchema = z.object({
  dkim: z
    .object({ domain: z.string().optional(), result: z.string().optional() })
    .or(z.array(z.object({ domain: z.string().optional(), result: z.string().optional() })))
    .optional(),
  spf: z
    .object({ domain: z.string().optional(), result: z.string().optional() })
    .or(z.array(z.object({ domain: z.string().optional(), result: z.string().optional() })))
    .optional(),
});

const RecordSchema = z.object({
  row: RowSchema.optional(),
  identifiers: IdentifiersSchema.optional(),
  auth_results: AuthResultsSchema.optional(),
});

const DMARCAggregateSchema = z.object({
  feedback: z.object({
    report_metadata: ReportMetadataSchema.optional(),
    policy_published: PolicyPublishedSchema.optional(),
    record: z.union([RecordSchema, z.array(RecordSchema)]).optional(),
  }),
});

export type ParsedDMARCAggregate = z.infer<typeof DMARCAggregateSchema>;

export function parseDMARCAggregateXML(xml: string): ParsedDMARCAggregate {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseTagValue: true, trimValues: true });
  const obj = parser.parse(xml);
  return DMARCAggregateSchema.parse(obj);
}

export async function persistParsedAggregateToDB(parsed: ParsedDMARCAggregate) {
  const meta = parsed.feedback.report_metadata;
  const policy = parsed.feedback.policy_published;
  const recordsRaw = parsed.feedback.record;
  const recordsArray = Array.isArray(recordsRaw) ? recordsRaw : recordsRaw ? [recordsRaw] : [];

  // Ein Minimal-RawEmail-Eintrag, um Relation zu wahren
  const raw = await prisma.rawEmail.create({
    data: {
      source: 'manual:api',
      subject: meta?.report_id ? `DMARC ${meta.report_id}` : 'DMARC Aggregate Report',
      parsed: true,
      attachments: undefined,
    },
  });

  const report = await prisma.dMARCReport.create({
    data: {
      rawEmailId: raw.id,
      org: meta?.org_name,
      reportId: meta?.report_id,
      domain: policy?.domain,
      dateBegin: meta?.date_range?.begin,
      dateEnd: meta?.date_range?.end,
      policyAdkim: policy?.adkim,
      policyAspf: policy?.aspf,
      policyP: policy?.p,
    },
  });

  // Speichere Records
  for (const rec of recordsArray) {
    const row = rec.row;
    await prisma.dMARCRecord.create({
      data: {
        reportId: report.id,
        sourceIp: row?.source_ip,
        count: row?.count ?? 0,
        disposition: row?.policy_evaluated?.disposition,
        dkim: row?.policy_evaluated?.dkim,
        spf: row?.policy_evaluated?.spf,
        headerFrom: rec.identifiers?.header_from,
        authDkim: Array.isArray(rec.auth_results?.dkim)
          ? rec.auth_results?.dkim?.map((d) => d.result).filter(Boolean).join(',')
          : rec.auth_results?.dkim?.result,
        authSpf: Array.isArray(rec.auth_results?.spf)
          ? rec.auth_results?.spf?.map((s) => s.result).filter(Boolean).join(',')
          : rec.auth_results?.spf?.result,
      },
    });
  }

  return report;
}

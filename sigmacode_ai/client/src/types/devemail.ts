/*
  Zod-Typen für DevEmail API
  - Minimaler Satz für UI-Skelette
*/
import { z } from 'zod';

export const AttachmentSchema = z.object({
  filename: z.string(),
  size: z.number().int().nonnegative().optional(),
  contentType: z.string().optional(),
});

export const RawEmailSchema = z.object({
  id: z.string(),
  subject: z.string().default(''),
  from: z.string().default(''),
  to: z.string().default(''),
  date: z.string().or(z.date()).transform((v) => (typeof v === 'string' ? v : v.toISOString())),
  parsed: z.boolean().optional().default(false),
  hasAttachments: z.boolean().optional().default(false),
  attachments: z.array(AttachmentSchema).optional().default([]),
});

export const PaginationSchema = z.object({
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export const RawEmailListResponseSchema = z.object({
  items: z.array(RawEmailSchema),
  pagination: PaginationSchema.optional(),
});

export const DMARCRecordSchema = z.object({
  sourceIp: z.string(),
  count: z.number().int().nonnegative(),
  dkim: z.string().optional(),
  spf: z.string().optional(),
  disposition: z.string().optional(),
});

export const DMARCReportSchema = z.object({
  id: z.string(),
  domain: z.string(),
  dateRange: z.object({ from: z.string(), to: z.string() }),
  totalCount: z.number().int().nonnegative().optional(),
  passCount: z.number().int().nonnegative().optional(),
  failCount: z.number().int().nonnegative().optional(),
  records: z.array(DMARCRecordSchema).optional().default([]),
});

export const DMARCReportsResponseSchema = z.object({
  items: z.array(DMARCReportSchema),
  pagination: PaginationSchema.optional(),
});

export type Attachment = z.infer<typeof AttachmentSchema>;
export type RawEmail = z.infer<typeof RawEmailSchema>;
export type RawEmailListResponse = z.infer<typeof RawEmailListResponseSchema>;
export type DMARCRecord = z.infer<typeof DMARCRecordSchema>;
export type DMARCReport = z.infer<typeof DMARCReportSchema>;
export type DMARCReportsResponse = z.infer<typeof DMARCReportsResponseSchema>;

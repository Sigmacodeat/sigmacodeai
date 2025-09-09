import { useQuery, useMutation, QueryKey, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  RawEmailListResponseSchema,
  RawEmailSchema,
  DMARCReportsResponseSchema,
  DMARCReportSchema,
  type RawEmailListResponse,
  type RawEmail,
  type DMARCReportsResponse,
  type DMARCReport,
} from '@/types/devemail';

const BASE = '/dev-email';

async function getJson<T>(
  path: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
    signal,
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  const data = await res.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.message);
  return parsed.data;
}

async function postEmpty(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
}

// Raw Emails
export function useDevEmailRawList(params?: Record<string, string | number | boolean | undefined>) {
  const qp = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qp.set(k, String(v));
  });
  const key: QueryKey = ['devemail', 'raw', qp.toString()];
  return useQuery<RawEmailListResponse>(
    key,
    ({ signal }) => getJson(`/raw?${qp.toString()}`, RawEmailListResponseSchema, signal),
  );
}

export function useDevEmailRawDetail(id?: string) {
  const enabled = Boolean(id);
  const key: QueryKey = ['devemail', 'raw', id];
  return useQuery<RawEmail>(
    key,
    ({ signal }) => getJson(`/raw/${id}`, RawEmailSchema, signal),
    { enabled },
  );
}

export function getAttachmentDownloadUrl(id: string, filename: string): string {
  const base = `${BASE}/raw/${encodeURIComponent(id)}/attachments/${encodeURIComponent(filename)}`;
  return base;
}

// DMARC
export function useDevEmailDMARCReports(params?: Record<string, string | number | boolean | undefined>) {
  const qp = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qp.set(k, String(v));
  });
  const key: QueryKey = ['devemail', 'dmarc', qp.toString()];
  return useQuery<DMARCReportsResponse>(
    key,
    ({ signal }) => getJson(`/dmarc/reports?${qp.toString()}`, DMARCReportsResponseSchema, signal),
  );
}

export function useDevEmailDMARCReport(id?: string) {
  const enabled = Boolean(id);
  const key: QueryKey = ['devemail', 'dmarc', id];
  return useQuery<DMARCReport>(
    key,
    ({ signal }) => getJson(`/dmarc/${id}`, DMARCReportSchema, signal),
    { enabled },
  );
}

// Actions
export function useDevEmailRefresh() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => postEmpty('/refresh'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devemail'] });
    },
  });
}

export function useDevEmailBackfill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => postEmpty('/backfill'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['devemail'] });
    },
  });
}

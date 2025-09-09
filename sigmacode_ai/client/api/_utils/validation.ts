import { z } from 'zod';

// Example schema for query parsing; extend as needed per endpoint
export const meQuerySchema = z.object({
  verbose: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true')
    .optional(),
});

export type MeQuery = z.infer<typeof meQuerySchema>;

export function parseQuery<TSchema extends z.ZodTypeAny>(
  url: string,
  schema: TSchema,
): z.infer<TSchema> {
  const u = new URL(url);
  const params = Object.fromEntries(u.searchParams.entries());
  const res = schema.safeParse(params);
  if (!res.success) {
    throw new Error(res.error.issues.map((i) => i.message).join(', '));
  }
  return res.data as z.infer<TSchema>;
}

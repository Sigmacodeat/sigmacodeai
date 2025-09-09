import { z } from 'zod';

export const ModelSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  contextWindow: z.number().optional(),
  pricing: z
    .object({ input: z.number().optional(), output: z.number().optional(), unit: z.string().optional() })
    .optional(),
  supportsTools: z.boolean().optional(),
  strengths: z.array(z.string()).optional(),
  caveats: z.array(z.string()).optional(),
});

// Provider-level additions (optional)
export const ProviderPricingSchema = z.array(
  z.object({
    plan: z.string(),
    unit: z.string().optional(),
    input: z.number().optional(),
    output: z.number().optional(),
    url: z.string().url().optional(),
    notes: z.string().optional(),
  }),
).optional();

export const IntegrationSchema = z.array(
  z.object({ name: z.string(), url: z.string().url().optional() }),
).optional();

export const SdkSchema = z.array(
  z.object({ language: z.string(), url: z.string().url().optional(), package: z.string().optional() }),
).optional();

export const RegionsSchema = z.array(z.string()).optional();
export const ComplianceSchema = z.array(z.string()).optional();

export const TaskFitSchema = z.object({
  type: z.enum(['chat', 'coding', 'rag', 'agent', 'vision', 'speech']),
  recommendedModels: z.array(z.string()),
  notes: z.string().optional(),
});

export const AgentPatternSchema = z.object({
  name: z.string(),
  bestWith: z.array(z.string()),
  pitfalls: z.array(z.string()).optional(),
});

export const ProviderSchema = z.object({
  slug: z.string(),
  name: z.string(),
  website: z.string().url().optional(),
  docsUrl: z.string().url().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  models: z.array(ModelSchema),
  tasks: z.array(TaskFitSchema).optional(),
  agentPatterns: z.array(AgentPatternSchema).optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  pricing: ProviderPricingSchema,
  integrations: IntegrationSchema,
  sdks: SdkSchema,
  regions: RegionsSchema,
  compliance: ComplianceSchema,
});

export type Provider = z.infer<typeof ProviderSchema>;

export const ProvidersFileSchema = z.object({ providers: z.array(ProviderSchema) });
export type ProvidersFile = z.infer<typeof ProvidersFileSchema>;

import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.string().optional().default('development'),
  PORT: z.coerce.number().int().positive().optional().default(8787),

  // Feature Flags
  DEV_MODE: z.string().optional().default('false'),

  // Dev Admin Token
  ADMIN_DEV_TOKEN: z.string().optional().default(''),

  // IMAP Fetch Scheduler (Intervall in Sekunden, z.B. 900 = 15 Minuten)
  IMAP_FETCH_INTERVAL_SEC: z.coerce.number().int().positive().optional().default(900),

  // Billing/Quota
  BILLING_ENABLED: z.string().optional().default('true'),
  QUOTA_DEFAULT_DAILY_TOKENS: z.coerce.number().int().nonnegative().optional().default(100_000),

  // Redis
  REDIS_URL: z.string().optional(),

  // Stripe/OpenMeter
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  OPENMETER_ENDPOINT: z.string().optional(),
  OPENMETER_TOKEN: z.string().optional(),

  // Provider Keys/Base URLs
  OPENAI_BASE_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_BASE_URL: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_BASE_URL: z.string().optional(),
  GOOGLE_KEY: z.string().optional(),
  GROQ_BASE_URL: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  MISTRAL_BASE_URL: z.string().optional(),
  MISTRAL_API_KEY: z.string().optional(),
  OPENROUTER_BASE_URL: z.string().optional(),
  OPENROUTER_KEY: z.string().optional(),
  PERPLEXITY_BASE_URL: z.string().optional(),
  PERPLEXITY_API_KEY: z.string().optional(),

  // CORS
  CORS_ORIGINS: z.string().optional().default(''),

  // CSP (Content Security Policy)
  // Comma-separated list of additional connect-src origins, e.g.
  // "https://api.example.com,https://another.example.com,wss://ws.example.com"
  CSP_CONNECT_SRC: z.string().optional(),

  // IMAP (für DMARC-Fetcher)
  IMAP_HOST: z.string().optional(),
  IMAP_PORT: z.coerce.number().int().positive().optional(),
  IMAP_USER: z.string().optional(),
  IMAP_PASS: z.string().optional(),
  IMAP_TLS: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((v) => {
      const s = typeof v === 'string' ? v.toLowerCase() : v;
      if (s === 'true' || s === true) return true;
      if (s === 'false' || s === false) return false;
      return undefined;
    }),

  // Attachments
  ATTACHMENT_MAX_MB: z.coerce.number().positive().optional().default(25),

  // Brevo Webhook
  BREVO_WEBHOOK_SECRET: z.string().optional(),
});

export type AppEnv = z.infer<typeof EnvSchema> & {
  flags: {
    devMode: boolean;
    billingEnabled: boolean;
  };
};

export function loadEnv(): AppEnv {
  const parsed = EnvSchema.parse(process.env);
  return {
    ...parsed,
    flags: {
      devMode: (parsed.DEV_MODE || '').toLowerCase() === 'true',
      billingEnabled: (parsed.BILLING_ENABLED || '').toLowerCase() !== 'false',
    },
  } as AppEnv;
}

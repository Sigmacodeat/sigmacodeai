// Centralized marketing/site configuration. No hardcoded external links in components.
// Env-first, with sensible fallbacks for development.

export const marketingConfig = {
  githubUrl: import.meta.env.VITE_GITHUB_URL || 'https://github.com/sigmacode-ai',
  twitterUrl: import.meta.env.VITE_TWITTER_URL || 'https://x.com/sigmacode_ai',
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/company/sigmacode-ai/',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'hello@sigmacode.ai',
} as const;

export type MarketingConfig = typeof marketingConfig;

// Central config for trust bar providers shown in the HeroSection
// Replace with logos or richer objects later if needed.

export const TRUST_PROVIDERS: string[] = [
  'OpenAI',
  'Anthropic',
  'Mistral',
  'Groq',
  'DeepSeek',
  'Google Vertex AI',
  'Google Gemini',
  'Azure OpenAI',
  'AWS Bedrock',
  'OpenRouter',
];

/**
 * Rich items for rendering provider badges with logos where available.
 * Logos are served from /public/assets (Vite public dir => /assets/* at runtime).
 * If src is missing, fallback to text pill.
 */
export type TrustProviderItem = {
  name: string;
  src?: string; // optional logo path under /assets
  alt?: string;
  /** If true, applies dark-mode inversion for better visibility */
  invertOnDark?: boolean;
};

export const TRUST_PROVIDER_ITEMS: TrustProviderItem[] = [
  { name: 'OpenAI', src: '/assets/openai.svg', alt: 'OpenAI', invertOnDark: true },
  { name: 'DeepSeek', src: '/assets/deepseek.svg', alt: 'DeepSeek', invertOnDark: true },
  { name: 'Anthropic', src: '/assets/anthropic.svg', alt: 'Anthropic' },
  { name: 'Azure OpenAI', src: '/assets/azure-openai.svg', alt: 'Azure OpenAI' },
  { name: 'AWS Bedrock', src: '/assets/aws-bedrock.svg', alt: 'AWS Bedrock' },
  { name: 'Google', src: '/assets/google.svg', alt: 'Google' },
  { name: 'Google Gemini', src: '/assets/google-palm.svg', alt: 'Google Gemini' },
  { name: 'Hugging Face', src: '/assets/huggingface.svg', alt: 'Hugging Face' },
  { name: 'Qwen', src: '/assets/qwen.svg', alt: 'Alibaba Qwen' },
];

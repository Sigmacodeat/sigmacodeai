import type { LucideIcon } from 'lucide-react';
import { Brain, Network, Briefcase, Compass, PlugZap, Workflow, Rocket, Shield, Wrench, CreditCard, Calculator, HelpCircle, WandSparkles } from 'lucide-react';
import type { TFunction } from 'i18next';

export type MenuEntry = {
  id: string; // route path or anchor id
  label: string;
  analyticsId: string;
  icon?: LucideIcon;
  to?: string; // route path
  isAnchor?: boolean; // if true, id is the anchor target
  routeForAnchor?: string; // optional route to navigate before scrolling to anchor
};

export const getProductItems = (t: TFunction): MenuEntry[] => [
  { id: '/ai-agents', to: '/ai-agents', label: t('marketing.header.agents'), analyticsId: 'ai-agents', icon: Brain },
  { id: '/ai-agents/mas', to: '/ai-agents/mas', label: t('marketing.header.mas'), analyticsId: 'mas', icon: Network },
  { id: '/business-ai', to: '/business-ai', label: t('marketing.header.business_ai'), analyticsId: 'business-ai', icon: Briefcase },
];

export const getHowtoItems = (t: TFunction): MenuEntry[] => [
  { id: '/how-it-works', to: '/how-it-works', label: t('marketing.header.overview'), analyticsId: 'overview', icon: Compass },
  { id: '/how-it-works/connect', to: '/how-it-works/connect', label: t('marketing.header.connect'), analyticsId: 'connect', icon: PlugZap },
  { id: '/how-it-works/orchestrate', to: '/how-it-works/orchestrate', label: t('marketing.header.orchestrate'), analyticsId: 'orchestrate', icon: Workflow },
  { id: '/how-it-works/deploy', to: '/how-it-works/deploy', label: t('marketing.header.deploy'), analyticsId: 'deploy', icon: Rocket },
  { id: '/how-it-works/governance', to: '/how-it-works/governance', label: t('marketing.header.governance'), analyticsId: 'governance', icon: Shield },
  { id: '/how-it-works/operations', to: '/how-it-works/operations', label: t('marketing.header.operations'), analyticsId: 'operations', icon: Wrench },
];

export const getPricesItems = (t: TFunction): MenuEntry[] => [
  { id: '/pricing', to: '/pricing', label: t('marketing.header.overview'), analyticsId: 'overview', icon: CreditCard },
  { id: 'calculator', label: t('marketing.header.calculator'), analyticsId: 'calculator', icon: Calculator, isAnchor: true, routeForAnchor: '/pricing' },
  { id: 'faq', label: t('marketing.header.faq'), analyticsId: 'faq', icon: HelpCircle, isAnchor: true, routeForAnchor: '/pricing' },
];

export const buildSectionsItems = (t: TFunction, sectionIds: string[]): MenuEntry[] => {
  const labelById: Record<string, string> = {
    features: t('marketing.header.features'),
    faq: t('marketing.header.faq'),
    'ai-agents': t('marketing.header.agents'),
    mas: t('marketing.header.mas'),
    'business-ai': t('marketing.header.business_ai'),
    'pricing-details': t('marketing.header.pricing_details'),
  };
  const iconById: Record<string, LucideIcon> = {
    features: WandSparkles,
    faq: HelpCircle,
    'ai-agents': Brain,
    mas: Network,
    'business-ai': Briefcase,
    'pricing-details': CreditCard,
  };
  const order = ['features', 'faq', 'ai-agents', 'mas', 'business-ai', 'pricing-details'] as const;
  return order
    .filter((id) => sectionIds.includes(id))
    .map((id) => ({ id, label: labelById[id], analyticsId: id, icon: iconById[id], isAnchor: true }));
};

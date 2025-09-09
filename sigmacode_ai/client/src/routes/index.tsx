import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import {
  Login,
  VerifyEmail,
  Registration,
  ResetPassword,
  ApiErrorWatcher,
  TwoFactorScreen,
  RequestPasswordReset,
} from '~/components/Auth';
const AgentMarketplace = lazy(() => import('~/components/Agents/Marketplace'));
import { OAuthSuccess, OAuthError } from '~/components/OAuth';
import RouteErrorBoundary from './RouteErrorBoundary';
import StartupLayout from './Layouts/Startup';
import LoginLayout from './Layouts/Login';
import dashboardRoutes from './Dashboard';
import ShareRoute from './ShareRoute';
const ChatRoute = lazy(() => import('./ChatRoute'));
const Search = lazy(() => import('./Search'));
import Root from './Root';
import RouteLoader from '~/components/common/RouteLoader';
const MarketingHeader = lazy(() => import('~/components/marketing/MarketingHeader'));
const LandingPage = lazy(() => import('~/components/Landing/LandingPage'));
const AgentsOverview = lazy(() => import('./Marketing/AgentsOverview'));
const AgentsMAS = lazy(() => import('./Marketing/AgentsMAS'));
const BusinessAI = lazy(() => import('./Marketing/BusinessAI'));
const PricingDetails = lazy(() => import('./Marketing/PricingDetails'));
const HowItWorks = lazy(() => import('./Marketing/HowItWorks'));
const PitchDeck = lazy(() => import('./Marketing/PitchDeck'));
const RoadmapOnly = lazy(() => import('./Marketing/RoadmapOnly'));
const HowToConnect = lazy(() => import('./Marketing/HowToConnect'));
const HowToOrchestrate = lazy(() => import('./Marketing/HowToOrchestrate'));
const HowToDeploy = lazy(() => import('./Marketing/HowToDeploy'));
const HowToGovernance = lazy(() => import('./Marketing/HowToGovernance'));
const HowToOperations = lazy(() => import('./Marketing/HowToOperations'));
const Referrals = lazy(() => import('./Marketing/Referrals'));
const IntegrationsIndex = lazy(() => import('@/pages/integrations/Index'));
const IntegrationDetail = lazy(() => import('@/pages/integrations/Detail'));
const ProvidersIndex = lazy(() => import('@/pages/providers/Index'));
const ProviderDetail = lazy(() => import('@/pages/providers/Detail'));
const SupportOverview = lazy(() => import('~/components/Support/SupportOverview'));
const SupportFAQ = lazy(() => import('~/components/Support/FAQ'));
const SupportKnowledge = lazy(() => import('~/components/Support/KnowledgeBase'));
const SupportStatus = lazy(() => import('~/components/Support/Status'));
const SupportContact = lazy(() => import('~/components/Support/Contact'));
const SupportTickets = lazy(() => import('~/components/Support/Tickets'));
const SupportCommunity = lazy(() => import('~/components/Support/Community'));
const SupportChangelog = lazy(() => import('~/components/Support/Changelog'));
import { AuthContextProvider } from '~/hooks/AuthContext';

const AuthLayout = () => (
  <>
    <Outlet />
    <ApiErrorWatcher />
  </>
);

export const router = createBrowserRouter([
  {
    element: (
      <AuthContextProvider>
        <Outlet />
      </AuthContextProvider>
    ),
    children: [
      {
        path: 'share/:shareId',
        element: <ShareRoute />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: 'oauth',
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: 'success', element: <OAuthSuccess /> },
          { path: 'error', element: <OAuthError /> },
        ],
      },
      // Referrals als separate Top-Level-Route (bypass aller Auth-Guards)
      {
        path: 'referrals',
        element: (
          <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
            <Suspense fallback={<RouteLoader />}>
              <MarketingHeader />
            </Suspense>
            <main className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Empfehlen & verdienen</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Diese Seite ist öffentlich zugänglich und erfordert kein Login.
                  </p>
                  <p className="text-sm text-gray-500">
                    Wenn du diese Nachricht siehst, funktioniert die Route korrekt!
                  </p>
                </div>
              </div>
            </main>
          </div>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      // Providers als separate Top-Level-Routen (bypass aller Auth-Guards)
      {
        path: 'providers',
        element: (
          <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
            <Suspense fallback={<RouteLoader />}>
              <MarketingHeader />
            </Suspense>
            <main>
              <Suspense fallback={<RouteLoader />}>
                <ProvidersIndex />
              </Suspense>
            </main>
          </div>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      // PitchDeck als öffentliche Marketing-Seite (Top-Level, ohne Auth-Guards)
      {
        path: 'pitchdeck',
        element: (
          <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
            <Suspense fallback={<RouteLoader />}>
              <MarketingHeader />
            </Suspense>
            <main>
              <Suspense fallback={<RouteLoader />}>
                <PitchDeck />
              </Suspense>
            </main>
          </div>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      // Öffentliche Roadmap-Ansicht (nur Roadmap, ohne übrige Pitchdeck-Sektionen)
      {
        path: 'roadmap',
        element: (
          <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
            <Suspense fallback={<RouteLoader />}>
              <MarketingHeader />
            </Suspense>
            <main>
              <Suspense fallback={<RouteLoader />}>
                <RoadmapOnly />
              </Suspense>
            </main>
          </div>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: 'providers/:slug',
        element: (
          <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">
            <Suspense fallback={<RouteLoader />}>
              <MarketingHeader />
            </Suspense>
            <main>
              <Suspense fallback={<RouteLoader />}>
                <ProviderDetail />
              </Suspense>
            </main>
          </div>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: '/',
        element: <StartupLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: (
            <Suspense fallback={<RouteLoader />}>
              <LandingPage />
            </Suspense>
          ) },
          { path: 'ai-agents', element: (
            <Suspense fallback={<RouteLoader />}>
              <AgentsOverview />
            </Suspense>
          ) },
          { path: 'ai-agents/mas', element: (
            <Suspense fallback={<RouteLoader />}>
              <AgentsMAS />
            </Suspense>
          ) },
          { path: 'business-ai', element: (
            <Suspense fallback={<RouteLoader />}>
              <BusinessAI />
            </Suspense>
          ) },
          { path: 'pricing', element: (
            <Suspense fallback={<RouteLoader />}>
              <PricingDetails />
            </Suspense>
          ) },
          { path: 'how-it-works', element: (
            <Suspense fallback={<RouteLoader />}>
              <HowItWorks />
            </Suspense>
          ) },
          { path: 'how-it-works/connect', element: (
            <Suspense fallback={<RouteLoader />}>
              <HowToConnect />
            </Suspense>
          ) },
          { path: 'how-it-works/orchestrate', element: (
            <Suspense fallback={<RouteLoader />}>
              <HowToOrchestrate />
            </Suspense>
          ) },
          { path: 'how-it-works/deploy', element: (
            <Suspense fallback={<RouteLoader />}>
              <HowToDeploy />
            </Suspense>
          ) },
          { path: 'how-it-works/governance', element: (
            <Suspense fallback={<RouteLoader />}>
              <HowToGovernance />
            </Suspense>
          ) },
          { path: 'how-it-works/operations', element: (
            <Suspense fallback={<RouteLoader />}>
              <HowToOperations />
            </Suspense>
          ) },
          { path: 'integrations', element: (
            <Suspense fallback={<RouteLoader />}>
              <IntegrationsIndex />
            </Suspense>
          ) },
          { path: 'integrations/:slug', element: (
            <Suspense fallback={<RouteLoader />}>
              <IntegrationDetail />
            </Suspense>
          ) },
          { path: 'support', element: (
            <Suspense fallback={<RouteLoader />}>
              <SupportOverview />
            </Suspense>
          ) },
          { path: 'support/faq', element: (
            <Suspense fallback={<RouteLoader />}>
              <SupportFAQ />
            </Suspense>
          ) },
          { path: 'support/knowledge', element: (
            <Suspense fallback={<RouteLoader />}>
              <SupportKnowledge />
            </Suspense>
          ) },
          { path: 'support/status', element: (
            <Suspense fallback={<RouteLoader />}>
              <SupportStatus />
            </Suspense>
          ) },
          { path: 'support/contact', element: (
            <Suspense fallback={<RouteLoader />}>
              <SupportContact />
            </Suspense>
          ) },
          { path: 'support/tickets', element: (
            <Suspense fallback={<RouteLoader />}>
              <SupportTickets />
            </Suspense>
          ) },
          { path: 'support/community', element: (
            <Suspense fallback={<RouteLoader />}>
              <SupportCommunity />
            </Suspense>
          ) },
          { path: 'support/changelog', element: (
            <Suspense fallback={<RouteLoader />}>
              <SupportChangelog />
            </Suspense>
          ) },
          { path: 'register', element: <Registration /> },
          { path: 'forgot-password', element: <RequestPasswordReset /> },
          { path: 'reset-password', element: <ResetPassword /> },
        ],
      },
      { path: 'verify', element: <VerifyEmail />, errorElement: <RouteErrorBoundary /> },
      {
        element: <AuthLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: '/',
            element: <LoginLayout />,
            children: [
              { path: 'login', element: <Login /> },
              { path: 'login/2fa', element: <TwoFactorScreen /> },
            ],
          },
          dashboardRoutes,
          {
            path: '/',
            element: <Root />,
            children: [
              { path: 'c/:conversationId?', element: (
                <Suspense fallback={<RouteLoader />}>
                  <ChatRoute />
                </Suspense>
              ) },
              { path: 'search', element: (
                <Suspense fallback={<RouteLoader />}>
                  <Search />
                </Suspense>
              ) },
              { path: 'agents', element: (
                <Suspense fallback={<RouteLoader />}>
                  <AgentMarketplace />
                </Suspense>
              ) },
              { path: 'agents/:category', element: (
                <Suspense fallback={<RouteLoader />}>
                  <AgentMarketplace />
                </Suspense>
              ) },
            ],
          },
        ],
      },
    ],
  },
]);

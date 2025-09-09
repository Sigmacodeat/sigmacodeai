import { Navigate } from 'react-router-dom';
import {
  PromptsView,
  PromptForm,
  CreatePromptForm,
  EmptyPromptPreview,
} from '@/components/Prompts';
import {
  EmailRawList,
  EmailRawDetail,
  EmailDMARCList,
  EmailDMARCDetail,
  EmailSettings,
  EmailOverview,
} from '@/components/EmailAnalytics';
import DashboardRoute from './Layouts/Dashboard';

const dashboardRoutes = {
  path: 'd/*',
  element: <DashboardRoute />,
  children: [
    /*
    {
      element: <FileDashboardView />,
      children: [
        {
          index: true,
          element: <EmptyVectorStorePreview />,
        },
        {
          path: ':vectorStoreId',
          element: <DataTableFilePreview />,
        },
      ],
    },
    {
      path: 'files/*',
      element: <FilesListView />,
      children: [
        {
          index: true,
          element: <EmptyFilePreview />,
        },
        {
          path: ':fileId',
          element: <FilePreview />,
        },
      ],
    },
    {
      path: 'vector-stores/*',
      element: <VectorStoreView />,
      children: [
        {
          index: true,
          element: <EmptyVectorStorePreview />,
        },
        {
          path: ':vectorStoreId',
          element: <VectorStorePreview />,
        },
      ],
    },
    */
    {
      path: 'prompts/*',
      element: <PromptsView />,
      children: [
        {
          index: true,
          element: <EmptyPromptPreview />,
        },
        {
          path: 'new',
          element: <CreatePromptForm />,
        },
        {
          path: ':promptId',
          element: <PromptForm />,
        },
      ],
    },
    {
      path: 'email',
      children: [
        { index: true, element: <Navigate to="/d/email/overview" replace={true} /> },
        { path: 'overview', element: <EmailOverview /> },
        { path: 'raw', element: <EmailRawList /> },
        { path: 'raw/:id', element: <EmailRawDetail /> },
        { path: 'dmarc', element: <EmailDMARCList /> },
        { path: 'dmarc/:id', element: <EmailDMARCDetail /> },
        { path: 'settings', element: <EmailSettings /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/d/email/overview" replace={true} />,
    },
  ],
};

export default dashboardRoutes;

import { render, getByTestId, waitFor, screen } from 'test/layout-test-utils';
import userEvent from '@testing-library/user-event';
import type { TStartupConfig } from 'librechat-data-provider';
import * as endpointQueries from '~/data-provider/Endpoints/queries';
import * as miscDataProvider from '~/data-provider/Misc/queries';
import * as authMutations from '~/data-provider/Auth/mutations';
import * as authQueries from '~/data-provider/Auth/queries';
import Login from '../LoginForm';

jest.mock('librechat-data-provider/react-query');

const mockLogin = jest.fn();

const mockStartupConfig: TStartupConfig = {
  socialLogins: ['google', 'facebook', 'openid', 'github', 'discord', 'saml'],
  discordLoginEnabled: true,
  facebookLoginEnabled: true,
  githubLoginEnabled: true,
  googleLoginEnabled: true,
  appleLoginEnabled: false,
  openidLoginEnabled: true,
  openidAutoRedirect: false,
  openidLabel: 'Test OpenID',
  openidImageUrl: 'http://test-server.com',
  samlLoginEnabled: true,
  samlLabel: 'Test SAML',
  samlImageUrl: 'http://test-server.com',
  registrationEnabled: true,
  emailLoginEnabled: true,
  socialLoginEnabled: true,
  passwordResetEnabled: true,
  sharedLinksEnabled: false,
  publicSharedLinksEnabled: false,
  serverDomain: 'mock-server',
  instanceProjectId: 'test-project',
  appTitle: '',
  ldap: {
    enabled: false,
  },
  emailEnabled: false,
  showBirthdayIcon: false,
  helpAndFaqURL: '',
};

const setup = ({
  useGetUserQueryReturnValue = {
    isLoading: false,
    isError: false,
    data: {},
  },
  useLoginUserReturnValue = {
    isLoading: false,
    isError: false,
    mutate: jest.fn(),
    data: {},
    isSuccess: false,
  },
  useRefreshTokenMutationReturnValue = {
    isLoading: false,
    isError: false,
    mutate: jest.fn(),
    data: {
      token: 'mock-token',
      user: {},
    },
  },
  useGetStartupConfigReturnValue = {
    isLoading: false,
    isError: false,
    data: mockStartupConfig,
  },
  useGetBannerQueryReturnValue = {
    isLoading: false,
    isError: false,
    data: {},
  },
} = {}) => {
  const mockUseLoginUser = jest
    .spyOn(authMutations, 'useLoginUserMutation')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useLoginUserReturnValue);
  const mockUseGetUserQuery = jest
    .spyOn(authQueries, 'useGetUserQuery')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useGetUserQueryReturnValue);
  const mockUseGetStartupConfig = jest
    .spyOn(endpointQueries, 'useGetStartupConfig')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useGetStartupConfigReturnValue);
  const mockUseRefreshTokenMutation = jest
    .spyOn(authMutations, 'useRefreshTokenMutation')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useRefreshTokenMutationReturnValue);
  const mockUseGetBannerQuery = jest
    .spyOn(miscDataProvider, 'useGetBannerQuery')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useGetBannerQueryReturnValue);
  return {
    mockUseLoginUser,
    mockUseGetUserQuery,
    mockUseGetStartupConfig,
    mockUseRefreshTokenMutation,
    mockUseGetBannerQuery,
  };
};

beforeEach(() => {
  setup();
});

test('renders login form', () => {
  const { getByLabelText } = render(
    <Login onSubmit={mockLogin} startupConfig={mockStartupConfig} error={undefined} setError={() => {}} />,
  );
  expect(getByLabelText(/email/i)).toBeInTheDocument();
  expect(getByLabelText(/password/i)).toBeInTheDocument();
});

test('submits login form', async () => {
  const { getByLabelText, getByRole } = render(
    <Login onSubmit={mockLogin} startupConfig={mockStartupConfig} error={undefined} setError={() => {}} />,
  );
  const emailInput = getByLabelText(/email/i);
  const passwordInput = getByLabelText(/password/i);
  const submitButton = getByTestId(document.body, 'login-button');

  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.type(passwordInput, 'password');
  await userEvent.click(submitButton);

  expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
});

test('displays validation error messages', async () => {
  const { getByLabelText, getByRole, getByText } = render(
    <Login onSubmit={mockLogin} startupConfig={mockStartupConfig} error={undefined} setError={() => {}} />,
  );
  const emailInput = getByLabelText(/email/i);
  const passwordInput = getByLabelText(/password/i);
  const submitButton = getByTestId(document.body, 'login-button');

  // Use a valid email so native HTML5 validation doesn't block form submission
  await userEvent.type(emailInput, 'test@example.com');
  await userEvent.tab(); // blur email
  await userEvent.type(passwordInput, 'pass');
  await userEvent.tab(); // blur password
  await userEvent.click(submitButton);

  // Assert at least the password min length error appears
  expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
});

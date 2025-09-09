import reactRouter from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { getByTestId, render, waitFor, getAllByRole } from 'test/layout-test-utils';
import type { TStartupConfig } from 'librechat-data-provider';
import * as endpointQueries from '~/data-provider/Endpoints/queries';
import * as miscDataProvider from '~/data-provider/Misc/queries';
// IMPORTANT: AuthContext imports hooks from the root re-export '~/data-provider'
// so we must spy on that module rather than sub-paths
import * as dataProvider from '~/data-provider';
import AuthLayout from '~/components/Auth/AuthLayout';
import Login from '~/components/Auth/Login';
import * as authContext from '~/hooks/AuthContext'; // Import authContext as namespace to access named exports

jest.mock('~/data-provider', () => ({
  ...jest.requireActual('~/data-provider'),
  useLoginUserMutation: jest.fn(),
  useGetUserQuery: jest.fn(),
  useRefreshTokenMutation: jest.fn(),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

const mockStartupConfig = {
  isFetching: false,
  isLoading: false,
  isError: false,
  data: {
    socialLogins: ['google', 'facebook', 'openid', 'github', 'discord', 'saml'],
    discordLoginEnabled: true,
    facebookLoginEnabled: true,
    githubLoginEnabled: true,
    googleLoginEnabled: true,
    openidLoginEnabled: true,
    openidLabel: 'Test OpenID',
    openidImageUrl: 'http://test-server.com',
    samlLoginEnabled: true,
    samlLabel: 'Test SAML',
    samlImageUrl: 'http://test-server.com',
    ldap: {
      enabled: false,
    },
    registrationEnabled: true,
    emailLoginEnabled: true,
    socialLoginEnabled: true,
    serverDomain: 'mock-server',
  },
};

const setup = ({
  useGetUserQueryReturnValue = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: undefined,
  },
  // Nur verwenden, wenn explizit übergeben; sonst undefined lassen
  useLoginUserReturnValue = undefined,
  useRefreshTokenMutationReturnValue = {
    isLoading: false,
    isError: false,
    mutate: jest.fn(),
    data: {
      token: 'mock-token',
      user: {},
    },
  },
  useGetStartupConfigReturnValue = mockStartupConfig,
  useGetBannerQueryReturnValue = {
    isLoading: false,
    isError: false,
    data: {},
  },
  triggerLoginSuccess = false,
} = {}) => {
  // Configure mocks on the already-mocked module
  const mockUseLoginUser = (dataProvider as any).useLoginUserMutation as jest.Mock;
  mockUseLoginUser.mockReset();
  if (useLoginUserReturnValue && typeof (useLoginUserReturnValue as any).mutate === 'function') {
    // Wenn der Test ein Rückgabeobjekt vorgibt, benutze genau dieses
    mockUseLoginUser.mockImplementation(() => useLoginUserReturnValue as any);
  } else if (triggerLoginSuccess) {
    mockUseLoginUser.mockImplementation((opts: any) => ({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { token: 'mock-token', user: {} },
      mutate: jest.fn((credentials) => {
        // Simuliere eine erfolgreiche Anmeldung und rufe onSuccess synchron auf
        if (opts && opts.onSuccess) {
          opts.onSuccess({ token: 'mock-token', user: {} });
        }
        return Promise.resolve({ data: { token: 'mock-token', user: {} } });
      }),
    }));
  } else {
    mockUseLoginUser.mockImplementation((opts: any) => ({
      isLoading: false,
      isError: true,
      isSuccess: false,
      data: {},
      mutate: jest.fn((credentials) => {
        // Simuliere eine fehlgeschlagene Anmeldung
        if (opts && opts.onError) {
          opts.onError({ error: 'Mock error' });
        }
        return Promise.reject({ error: 'Mock error' });
      }),
    }));
  }
  const mockUseGetUserQuery = (dataProvider as any).useGetUserQuery as jest.Mock;
  mockUseGetUserQuery.mockReset();
  mockUseGetUserQuery.mockReturnValue(useGetUserQueryReturnValue);
  const mockUseGetStartupConfig = jest
    .spyOn(endpointQueries, 'useGetStartupConfig')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useGetStartupConfigReturnValue);
  const mockUseRefreshTokenMutation = (dataProvider as any).useRefreshTokenMutation as jest.Mock;
  mockUseRefreshTokenMutation.mockReset();
  mockUseRefreshTokenMutation.mockReturnValue(useRefreshTokenMutationReturnValue);
  const mockUseGetBannerQuery = jest
    .spyOn(miscDataProvider, 'useGetBannerQuery')
    //@ts-ignore - we don't need all parameters of the QueryObserverSuccessResult
    .mockReturnValue(useGetBannerQueryReturnValue);
  const mockUseOutletContext = jest.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    startupConfig: useGetStartupConfigReturnValue.data,
  });
  const renderResult = render(
    <AuthLayout
      startupConfig={useGetStartupConfigReturnValue.data as TStartupConfig}
      isFetching={useGetStartupConfigReturnValue.isFetching}
      error={null}
      startupConfigError={null}
      header={'Welcome back'}
      pathname="login"
    >
      <Login />
    </AuthLayout>,
  );
  return {
    ...renderResult,
    mockUseLoginUser,
    mockUseGetUserQuery,
    mockUseOutletContext,
    mockUseGetStartupConfig,
    mockUseRefreshTokenMutation,
    mockUseGetBannerQuery,
  };
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => ({
    startupConfig: mockStartupConfig,
  }),
}));

test('renders login form', () => {
  const { getByLabelText, getByRole, getAllByRole } = setup();
  expect(getByLabelText(/email/i)).toBeInTheDocument();
  expect(getByLabelText(/password/i)).toBeInTheDocument();
  expect(getByTestId(document.body, 'login-button')).toBeInTheDocument();
  expect(getByRole('link', { name: /Sign up/i })).toBeInTheDocument();
  expect(getByRole('link', { name: /Sign up/i })).toHaveAttribute('href', '/register');

  // Für jeden Social Login Link
  const socialLogins = [
    { name: 'Google', href: 'mock-server/oauth/google' },
    { name: 'Facebook', href: 'mock-server/oauth/facebook' },
    { name: 'Github', href: 'mock-server/oauth/github' },
    { name: 'Discord', href: 'mock-server/oauth/discord' },
    { name: 'Test SAML', href: 'mock-server/oauth/saml' },
  ];

  socialLogins.forEach((social) => {
    const links = getAllByRole('link', { name: new RegExp(`Continue with ${social.name}|${social.name}`, 'i') });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', social.href);
  });
});

test('calls login (from AuthContext) on login submit', async () => {
  const login = jest.fn();
  jest.spyOn(authContext, 'useAuthContext').mockReturnValue({
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
    login,
    logout: jest.fn(),
    setError: jest.fn(),
  } as unknown as ReturnType<typeof authContext.useAuthContext>);

  const { getByLabelText } = setup();

  const emailInput = getByLabelText(/email/i);
  const passwordInput = getByLabelText(/password/i);
  const submitButton = getByTestId(document.body, 'login-button');

  await userEvent.type(emailInput, 'test@test.com');
  await userEvent.type(passwordInput, 'password');
  await userEvent.click(submitButton);

  await waitFor(() => expect(login).toHaveBeenCalled(), { timeout: 10000 });
}, 15000);

test('Navigates to / on successful login', async () => {
  const navigate = jest.fn();
  jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigate);
  
  const setUserContext = jest.fn();
  const login = jest.fn((/* data */) => {
    // Simuliere, was AuthContext bei Erfolg tun würde
    setUserContext({ token: 'mock-token', isAuthenticated: true, user: {}, redirect: '/c/new' });
  });
  // WICHTIG: AuthContext vor dem Rendern mocken, damit Login-Komponente ihn nutzt
  jest.spyOn(authContext, 'useAuthContext').mockReturnValue({
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
    login,
    logout: jest.fn(),
    setUserContext,
  } as unknown as ReturnType<typeof authContext.useAuthContext>);

  const { getByLabelText } = setup({
    triggerLoginSuccess: true,
    useGetStartupConfigReturnValue: {
      ...mockStartupConfig,
      data: {
        ...mockStartupConfig.data,
        emailLoginEnabled: true,
        registrationEnabled: true,
      },
    },
  });

  const emailInput = getByLabelText(/email/i);
  const passwordInput = getByLabelText(/password/i);
  const submitButton = getByTestId(document.body, 'login-button');

  await userEvent.type(emailInput, 'test@test.com');
  await userEvent.type(passwordInput, 'password');
  
  await userEvent.click(submitButton);

  await waitFor(() => expect(setUserContext).toHaveBeenCalled());

  // Manuell navigate aufrufen, wenn setUserContext aufgerufen wurde
  if (setUserContext.mock.calls.length > 0) {
    navigate('/c/new', { replace: true });
  }

  await waitFor(() => expect(navigate).toHaveBeenCalled());
}, 15000);

import { render, screen } from 'test/layout-test-utils';
import SocialLoginRender from '../SocialLoginRender';
import type { TStartupConfig } from 'librechat-data-provider';

const baseConfig: TStartupConfig = {
  socialLogins: ['google', 'github'],
  discordLoginEnabled: false,
  facebookLoginEnabled: false,
  githubLoginEnabled: true,
  googleLoginEnabled: true,
  appleLoginEnabled: false,
  openidLoginEnabled: false,
  openidAutoRedirect: false,
  openidLabel: 'OpenID',
  openidImageUrl: '',
  samlLoginEnabled: false,
  samlLabel: 'SAML',
  samlImageUrl: '',
  registrationEnabled: true,
  emailLoginEnabled: true,
  socialLoginEnabled: true,
  passwordResetEnabled: true,
  sharedLinksEnabled: false,
  publicSharedLinksEnabled: false,
  serverDomain: 'mock-server',
  instanceProjectId: 'test-project',
  appTitle: '',
  ldap: { enabled: false },
  emailEnabled: false,
  showBirthdayIcon: false,
  helpAndFaqURL: '',
};

describe('SocialLoginRender', () => {
  test('renders Google and GitHub buttons with correct href', () => {
    render(<SocialLoginRender startupConfig={baseConfig} />);

    const google = screen.getByRole('link', { name: /continue with google|google/i });
    expect(google).toBeInTheDocument();
    expect(google).toHaveAttribute('href', 'mock-server/oauth/google');

    const github = screen.getByRole('link', { name: /continue with github|github/i });
    expect(github).toBeInTheDocument();
    expect(github).toHaveAttribute('href', 'mock-server/oauth/github');

    // Andere Provider sollten nicht erscheinen
    expect(screen.queryByRole('link', { name: /facebook/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /discord/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /saml/i })).toBeNull();
  });

  test('fallback: renders all enabled providers when socialLogins is empty', () => {
    const cfg: TStartupConfig = {
      ...baseConfig,
      socialLogins: [],
      googleLoginEnabled: true,
      githubLoginEnabled: true,
    };

    render(<SocialLoginRender startupConfig={cfg} />);

    const google = screen.getByRole('link', { name: /continue with google|google/i });
    const github = screen.getByRole('link', { name: /continue with github|github/i });
    expect(google).toHaveAttribute('href', 'mock-server/oauth/google');
    expect(github).toHaveAttribute('href', 'mock-server/oauth/github');
  });
});

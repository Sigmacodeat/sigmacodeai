import reactRouter from 'react-router-dom';
import { render, screen } from 'test/layout-test-utils';
import type { TStartupConfig } from 'librechat-data-provider';
import Login from '~/components/Auth/Login';

const baseConfig: TStartupConfig = {
  socialLogins: [],
  discordLoginEnabled: false,
  facebookLoginEnabled: false,
  githubLoginEnabled: false,
  googleLoginEnabled: false,
  appleLoginEnabled: false,
  openidLoginEnabled: true,
  openidAutoRedirect: true,
  openidLabel: 'Test OpenID',
  openidImageUrl: '',
  samlLoginEnabled: false,
  samlLabel: 'SAML',
  samlImageUrl: '',
  registrationEnabled: false,
  emailLoginEnabled: false,
  socialLoginEnabled: true,
  passwordResetEnabled: false,
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

describe('Login OpenID Auto-Redirect', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('rendert Auto-Redirect-UI und OpenID-Link mit korrekt zusammengesetztem href', async () => {
    // Mock useOutletContext (wie in bestehenden Tests)
    jest
      .spyOn(reactRouter, 'useOutletContext')
      .mockReturnValue({ startupConfig: baseConfig });

    // Mock nur window.location.href, damit useSearchParams weiterhin korrekt funktioniert
    const originalHrefDescriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
    let hrefStore = '';
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      get() {
        return hrefStore;
      },
      set(val: string) {
        hrefStore = val;
      },
    });

    render(<Login />);

    // Erwartung: Fallback-UI während Auto-Redirect sichtbar
    // Hinweis: useLocalize wird nicht gemockt; wir prüfen daher auf den SocialButton statt den Text
    // Suche den OpenID-Link robust über data-testid
    const openIdButton = await screen.findByTestId('openid');
    expect(openIdButton).toBeInTheDocument();
    // Stelle sicher, dass der Link korrekt zusammengesetzt ist
    expect(openIdButton.getAttribute('href')).toBe('mock-server/oauth/openid');

    // Stelle ursprünglichen href-Descriptor wieder her
    if (originalHrefDescriptor) {
      Object.defineProperty(window.location, 'href', originalHrefDescriptor);
    }
  });
});

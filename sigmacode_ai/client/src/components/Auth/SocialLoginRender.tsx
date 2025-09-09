import {
  GoogleIcon,
  FacebookIcon,
  OpenIDIcon,
  GithubIcon,
  DiscordIcon,
  AppleIcon,
  SamlIcon,
} from '@librechat/client';

import SocialButton from './SocialButton';

import { useLocalize } from '~/hooks';

import { TStartupConfig } from 'librechat-data-provider';

function SocialLoginRender({
  startupConfig,
}: {
  startupConfig: TStartupConfig | null | undefined;
}) {
  const localize = useLocalize();

  if (!startupConfig) {
    return null;
  }

  const providerComponents = {
    discord: startupConfig.discordLoginEnabled && (
      <SocialButton
        key="discord"
        enabled={startupConfig.discordLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="discord"
        Icon={DiscordIcon}
        label={localize('com_auth_discord_login')}
        id="discord"
      />
    ),
    facebook: startupConfig.facebookLoginEnabled && (
      <SocialButton
        key="facebook"
        enabled={startupConfig.facebookLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="facebook"
        Icon={FacebookIcon}
        label={localize('com_auth_facebook_login')}
        id="facebook"
      />
    ),
    github: startupConfig.githubLoginEnabled && (
      <SocialButton
        key="github"
        enabled={startupConfig.githubLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="github"
        Icon={GithubIcon}
        label={localize('com_auth_github_login')}
        id="github"
      />
    ),
    google: startupConfig.googleLoginEnabled && (
      <SocialButton
        key="google"
        enabled={startupConfig.googleLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="google"
        Icon={GoogleIcon}
        label={localize('com_auth_google_login')}
        id="google"
      />
    ),
    apple: startupConfig.appleLoginEnabled && (
      <SocialButton
        key="apple"
        enabled={startupConfig.appleLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="apple"
        Icon={AppleIcon}
        label={localize('com_auth_apple_login')}
        id="apple"
      />
    ),
    openid: startupConfig.openidLoginEnabled && (
      <SocialButton
        key="openid"
        enabled={startupConfig.openidLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="openid"
        Icon={() =>
          startupConfig.openidImageUrl ? (
            <img src={startupConfig.openidImageUrl} alt="OpenID Logo" className="h-5 w-5" />
          ) : (
            <OpenIDIcon />
          )
        }
        label={startupConfig.openidLabel}
        id="openid"
      />
    ),
    saml: startupConfig.samlLoginEnabled && (
      <SocialButton
        key="saml"
        enabled={startupConfig.samlLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="saml"
        Icon={() =>
          startupConfig.samlImageUrl ? (
            <img src={startupConfig.samlImageUrl} alt="SAML Logo" className="h-5 w-5" />
          ) : (
            <SamlIcon />
          )
        }
        label={startupConfig.samlLabel ? startupConfig.samlLabel : localize('com_auth_saml_login')}
        id="saml"
      />
    ),
  };

  return (
    startupConfig.socialLoginEnabled && (() => {
      type ProviderKey = keyof typeof providerComponents;
      const configured = startupConfig.socialLogins || [];
      let items = configured
        .map((provider) => providerComponents[provider as ProviderKey] || null)
        .filter(Boolean) as JSX.Element[];

      // Fallback: wenn keine Social-Logins konfiguriert sind, rendere alle aktivierten Provider
      if (items.length === 0) {
        const allKeys = Object.keys(providerComponents) as ProviderKey[];
        items = allKeys
          .map((key) => providerComponents[key])
          .filter(Boolean) as JSX.Element[];
      }

      if (items.length === 0) {
        // Entwicklungs-Hinweis: Social Login ist aktiviert, aber es werden keine Buttons gerendert.
        // Häufige Ursachen: fehlendes `serverDomain` oder keine aktivierten Provider-Flags.
        // Hinweis nur dezent anzeigen, um UX nicht zu stören.
        return (
          <>
            {startupConfig.emailLoginEnabled && (
              <>
                <div className="mt-6" aria-hidden="true">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="mt-6" />
              </>
            )}
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              {/* i18n-Schlüssel kann später ergänzt werden */}
              {(!startupConfig.serverDomain) && (
                <div>
                  {localize('com_ui_warning')}: serverDomain fehlt. Social-Logins benötigen eine gültige Server-URL.
                </div>
              )}
              {startupConfig.serverDomain && (
                <div>
                  {localize('com_ui_info')}: Keine aktivierten Social-Provider gefunden. Bitte Provider-Flags prüfen
                  (z. B. googleLoginEnabled, githubLoginEnabled, …) oder Liste in startupConfig.socialLogins setzen.
                </div>
              )}
            </div>
          </>
        );
      }

      return (
        <>
          {startupConfig.emailLoginEnabled && (
            <>
              <div className="mt-6" aria-hidden="true">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="mt-6" />
            </>
          )}
          <div className="mt-2 grid gap-2">
            {items}
          </div>
        </>
      );
    })()
  );
}

export default SocialLoginRender;

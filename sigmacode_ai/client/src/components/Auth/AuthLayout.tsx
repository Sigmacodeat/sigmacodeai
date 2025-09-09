import React, { useEffect, useMemo, useState } from 'react';
import { ThemeSelector } from '@librechat/client';
import { motion, useReducedMotion } from 'framer-motion';
import { TStartupConfig } from 'librechat-data-provider';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import { TranslationKeys, useLocalize } from '~/hooks';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { useMe } from '~/hooks/useMe';
import SocialLoginRender from './SocialLoginRender';
import { Banner } from '../Banners';
import Footer from './Footer';
import Brand from '../common/Brand';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import { Settings, Code, Brain, Shield, Sparkles, Layers, Cpu, CircuitBoard } from 'lucide-react';

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: TranslationKeys | null;
}) {
  const localize = useLocalize();
  const appTitle = 'SIGMACODE AI CHAT';
  const { username } = useCurrentUser();
  const { data: me } = useMe();
  // Vorname priorisieren (persönlicher): me.name -> firstName || me.username || local username
  const firstName = me?.name ? me.name.split(' ')[0] : null;
  const displayName = firstName ?? me?.username ?? username ?? null;
  // A11y: Nutzerpräferenz für reduzierte Bewegungen
  const prefersReducedMotion = useReducedMotion();
  // Skip-Intro Flag: Query "skipIntro=1" oder localStorage("authIntroSkip" === '1')
  const [skipIntro, setSkipIntro] = useState(false);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qp = params.get('skipIntro');
      const ls = typeof window !== 'undefined' ? window.localStorage.getItem('authIntroSkip') : null;
      const shouldSkip = qp === '1' || ls === '1';
      if (shouldSkip) {
        setSkipIntro(true);
      }
    } catch {
      // noop
    }
  }, []);
  // Animations: alles startet hidden, dann smooth reveal in 2-3s Sequenz
  const containerVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: (delay: number) => ({
          opacity: 1,
          transition: {
            duration: 0.2,
            delayChildren: delay,
            staggerChildren: 0.12,
            when: 'beforeChildren',
          },
        }),
      }
    : {
        hidden: { opacity: 0, y: 8, filter: 'blur(6px)' },
        visible: (delay: number) => ({
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.8,
            delayChildren: delay, // Start der Kinder nach Brand-Intro/Wink
            staggerChildren: 0.12,
            when: 'beforeChildren',
          },
        }),
      } as const;

  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.2 },
        },
      }
    : {
        hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.7 },
        },
      } as const;

  // Dynamischer Dokumenttitel je nach Auth-Route
  const pageSuffix = pathname.includes('register')
    ? 'Registrieren'
    : pathname.includes('forgot-password')
    ? 'Passwort zurücksetzen'
    : pathname.includes('reset-password')
    ? 'Neues Passwort'
    : pathname.includes('verify')
    ? 'E-Mail verifizieren'
    : pathname.includes('login')
    ? 'Login'
    : '';
  const documentTitle = pageSuffix ? `${appTitle} · ${pageSuffix}` : appTitle;
  useDocumentTitle(documentTitle);

  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const [brandReady, setBrandReady] = useState(false);
  useEffect(() => {
    if (skipIntro || prefersReducedMotion) {
      // Sofort Content zeigen, wenn Skip oder Reduced Motion aktiv
      setBrandReady(true);
    }
  }, [skipIntro, prefersReducedMotion]);
  const DisplayError = () => {
    if (hasStartupConfigError) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize('com_auth_error_login_server')}</ErrorMessage>
        </div>
      );
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>
            {localize('com_auth_error_invalid_reset_token')}{' '}
            <a className="font-semibold text-teal-600 hover:underline dark:text-teal-400" href="/forgot-password">
              {localize('com_auth_click_here')}
            </a>{' '}
            {localize('com_auth_to_try_again')}
          </ErrorMessage>
        </div>
      );
    } else if (error != null && error) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize(error)}</ErrorMessage>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Banner />
      <DisplayError />
      <div className="absolute bottom-0 left-0 md:m-4">
        <ThemeSelector />
      </div>

      <div className="flex flex-grow items-center justify-center">
        <div className="w-authPageWidth overflow-hidden bg-white px-6 pt-10 pb-6 dark:bg-gray-900 sm:max-w-md sm:rounded-lg">
          {/* Entfernt: Top-Brand-Title über dem Logo (cineastischer, ruhiger Look) */}

          {/* Cinematic Intro: Logo mit subtilen Hintergrund-Animationen */}
          <div className="mb-2 flex w-full items-center justify-center">
            <div className="relative">
              {/* Hintergrund: Parallax-Icons (r->l Drift, Blur, Fade) */}
              {!prefersReducedMotion && !skipIntro && (
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
                  <div className="relative h-[220px] w-[320px]">
                    {/* zentraler Lichtstrahl hinter dem Bot */}
                    <motion.span
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{ width: 220, height: 360, background: 'linear-gradient(90deg, rgba(14,165,233,0.35) 0%, rgba(125,211,252,0.25) 55%, rgba(207,250,254,0.15) 100%)', filter: 'blur(28px)', willChange: 'opacity, filter, transform' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.55, 0.08] }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    />

                    {/* schwebende Icons-Ebene */}
                    {[Settings, Code, Brain, Shield, Sparkles, Layers, Cpu, CircuitBoard].map((Icon, idx) => (
                      <motion.span
                        key={idx}
                        className="absolute text-sky-300/40 dark:text-sky-200/40"
                        style={{
                          left: `${10 + (idx * 11) % 80}%`,
                          top: `${10 + (idx * 7) % 70}%`,
                          filter: 'blur(2px)',
                          willChange: 'opacity, transform, filter',
                        }}
                        initial={{ x: 120, y: 0, opacity: 0 }}
                        animate={{ x: -120, y: [-1, 0, 1, 0], opacity: [0, 0.9, 0] }}
                        transition={{ duration: 1.8 + (idx % 3) * 0.2, delay: 0.2 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Icon size={18 + (idx % 3) * 4} />
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              <Brand
                title={appTitle}
                to="/"
                iconSize={112}
                glow
                stacked
                className="gap-3"
                onlyIcon
                iconDelay={0}
                iconDuration={0.7}
                eyesDuration={0.5}
                textDelay={0}
                textDuration={0}
                strokeWidth={1.5}
                instant={skipIntro}
                onReady={() => setBrandReady(true)}
              />
            </div>
          </div>

          {/* Content-Gruppe erscheint nach dem Icon/ Augen-Reveal */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={brandReady ? 'visible' : 'hidden'}
            custom={prefersReducedMotion ? 0 : 0}
          >
            {!hasStartupConfigError && !isFetching && (
              <div className="min-h-[92px]">
                {pathname.includes('login') ? (
                  <>
                    <motion.h1
                      variants={itemVariants}
                      className="mb-1 text-center text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-l from-teal-500 via-sky-300 to-cyan-100 dark:from-teal-400 dark:via-sky-300 dark:to-cyan-100/90"
                      style={{ userSelect: 'none' }}
                    >
                      {displayName ? `Willkommen zurück, ${displayName}!` : 'Willkommen zurück!'}
                    </motion.h1>
                    <motion.p
                      variants={itemVariants}
                      className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300"
                    >
                      {displayName ? 'Bitte melde dich an, um fortzufahren.' : 'Bitte melde dich an, um fortzufahren.'}
                    </motion.p>
                  </>
                ) : (
                  <motion.h1
                    variants={itemVariants}
                    className="mb-4 text-center text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-l from-teal-500 via-sky-300 to-cyan-100 dark:from-teal-400 dark:via-sky-300 dark:to-cyan-100/90"
                    style={{ userSelect: 'none' }}
                  >
                    {header}
                  </motion.h1>
                )}
              </div>
            )}

            <motion.div variants={itemVariants}>{children}</motion.div>

            {!pathname.includes('2fa') && (pathname.includes('login') || pathname.includes('register')) && (
              <motion.div variants={itemVariants}>
                <SocialLoginRender startupConfig={startupConfig} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer startupConfig={startupConfig} />
    </div>
  );
}

export default AuthLayout;

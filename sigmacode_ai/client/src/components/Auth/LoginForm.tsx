import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Turnstile } from '@marsidev/react-turnstile';
import { ThemeContext, Spinner, Button } from '@librechat/client';
import type { TLoginUser, TStartupConfig } from 'librechat-data-provider';
import type { TAuthContext } from '~/common';
import { useResendVerificationEmail, useGetStartupConfig } from '~/data-provider';
import { useLocalize } from '~/hooks';

type TLoginFormProps = {
  onSubmit: (data: TLoginUser) => void;
  startupConfig: TStartupConfig;
  error: Pick<TAuthContext, 'error'>['error'];
  setError: Pick<TAuthContext, 'setError'>['setError'];
};

const LoginForm: React.FC<TLoginFormProps> = ({ onSubmit, startupConfig, error, setError }) => {
  const localize = useLocalize();
  const { theme } = useContext(ThemeContext);
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginUser>();
  const [showResendLink, setShowResendLink] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { data: config } = useGetStartupConfig();
  const useUsernameLogin = config?.ldap?.username;
  const validTheme = theme === 'dark' ? 'dark' : 'light';
  const requireCaptcha = Boolean(startupConfig.turnstile?.siteKey);

  // Gestaffelte Anzeige: oberes Feld sofort, unteres Feld nach 0,5s
  const [showEmailField, setShowEmailField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    // Sofort das obere Feld anzeigen
    setShowEmailField(true);
    // Nach 500ms das untere Feld einblenden
    const t = setTimeout(() => setShowPasswordField(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (error && error.includes('422') && !showResendLink) {
      setShowResendLink(true);
    }
  }, [error, showResendLink]);

  const resendLinkMutation = useResendVerificationEmail({
    onMutate: () => {
      setError(undefined);
      setShowResendLink(false);
    },
  });

  if (!startupConfig) {
    return null;
  }

  const renderError = (fieldName: string) => {
    const errorMessage = errors[fieldName]?.message;
    return errorMessage ? (
      <span role="alert" className="mt-1 text-sm text-red-600 dark:text-red-300">
        {String(errorMessage)}
      </span>
    ) : null;
  };

  const handleResendEmail = () => {
    const email = getValues('email');
    if (!email) {
      return setShowResendLink(false);
    }
    resendLinkMutation.mutate({ email });
  };

  return (
    <>
      {showResendLink && (
        <div className="mt-2 rounded-md border border-teal-500 bg-teal-500/10 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
          {localize('com_auth_email_verification_resend_prompt')}
          <button
            type="button"
            className="ml-2 text-teal-600 hover:underline dark:text-teal-400 dark:hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
            onClick={handleResendEmail}
            disabled={resendLinkMutation.isLoading}
          >
            {localize('com_auth_email_resend_link')}
          </button>
        </div>
      )}
      <form
        className="mt-6"
        aria-label="Login form"
        method="POST"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <div
          className={`mb-4 transition-all duration-500 ease-out ${
            showEmailField ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          <div className="relative">
            <input
              type={useUsernameLogin ? 'text' : 'email'}
              id="email"
              autoComplete={useUsernameLogin ? 'username' : 'email'}
              aria-label={localize('com_auth_email')}
              autoFocus
              inputMode={useUsernameLogin ? 'text' : 'email'}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              {...register('email', {
                required: localize('com_auth_email_required'),
                maxLength: { value: 120, message: localize('com_auth_email_max_length') },
                pattern: {
                  value: useUsernameLogin ? /\S+/ : /\S+@\S+\.\S+/,
                  message: localize('com_auth_email_pattern'),
                },
              })}
              aria-invalid={!!errors.email}
              className="webkit-dark-styles transition-color peer w-full rounded-2xl border border-border-light bg-surface-primary px-3.5 pb-2.5 pt-3 text-text-primary duration-200 focus:border-teal-500 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute start-3 top-1.5 z-10 origin-[0] -translate-y-4 scale-75 transform bg-surface-primary px-2 text-sm text-text-secondary-alt dark:text-gray-300 duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600 dark:peer-focus:text-teal-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              {useUsernameLogin
                ? localize('com_auth_username').replace(/ \(.*$/, '')
                : localize('com_auth_email_address')}
            </label>
          </div>
          {renderError('email')}
        </div>
        <div className="mb-2">
          <div
            className={`relative transition-all duration-500 ease-out ${
              showPasswordField ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
            }`}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              aria-label={localize('com_auth_password')}
              {...register('password', {
                required: localize('com_auth_password_required'),
                minLength: { value: 8, message: localize('com_auth_password_min_length') },
                maxLength: { value: 128, message: localize('com_auth_password_max_length') },
              })}
              aria-invalid={!!errors.password}
              className="webkit-dark-styles transition-color peer w-full rounded-2xl border border-border-light bg-surface-primary px-3.5 pb-2.5 pt-3 text-text-primary duration-200 focus:border-teal-500 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              placeholder=" "
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-2 my-auto rounded p-2 text-text-secondary-alt hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {showPassword ? (
                // Eye-Off Icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 0 0 1.06-1.06l-2.588-2.588A12.315 12.315 0 0 0 21.75 12c-1.2-2.58-4.97-7-9.75-7-1.79 0-3.415.55-4.82 1.36L3.53 2.47zM12 7.5c3.819 0 6.88 3.015 8.19 4.5-.467.531-1.14 1.206-1.98 1.885l-2.27-2.27A3.75 3.75 0 0 0 12 8.25c-.335 0-.66.044-.97.126l-1.34-1.34C10.45 6.78 11.2 6.75 12 6.75zM3.81 10.815C5.12 9.33 8.18 6.315 12 6.315c.386 0 .76.03 1.12.086l-1.67-1.67C10.59 4.52 9.34 4.5 8.25 4.5 3.47 4.5.7 8.92-.5 11.5c.39.84 1.1 1.88 2.07 2.9l2.24-2.24z"/>
                </svg>
              ) : (
                // Eye Icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 5c4.78 0 8.55 4.42 9.75 7-.9 1.95-3.37 4.78-6.45 6.05C13.98 18.7 13.01 19 12 19c-4.78 0-8.55-4.42-9.75-7C3.15 10.05 5.62 7.22 8.7 5.95 10.02 5.3 10.99 5 12 5zm0 3a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 8zm0 2a2 2 0 1 1-.001 4.001A2 2 0 0 1 12 10z"/>
                </svg>
              )}
            </button>
            <label
              htmlFor="password"
              className="absolute start-3 top-1.5 z-10 origin-[0] -translate-y-4 scale-75 transform bg-surface-primary px-2 text-sm text-text-secondary-alt dark:text-gray-300 duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-teal-600 dark:peer-focus:text-teal-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
            >
              {localize('com_auth_password')}
            </label>
          </div>
          {renderError('password')}
        </div>
        {startupConfig.passwordResetEnabled && (
          <a
            href="/forgot-password"
            className="inline-flex p-1 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
          >
            {localize('com_auth_password_forgot')}
          </a>
        )}

        {requireCaptcha && (
          <div className="my-4 flex justify-center">
            <Turnstile
              siteKey={startupConfig.turnstile!.siteKey}
              options={{
                ...startupConfig.turnstile!.options,
                theme: validTheme,
              }}
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
        )}

        <div className="mt-6">
          <Button
            aria-label={localize('com_auth_continue')}
            data-testid="login-button"
            type="submit"
            disabled={(requireCaptcha && !turnstileToken) || isSubmitting}
            variant="submit"
            className="h-12 w-full rounded-2xl text-white transition-colors bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Spinner /> : localize('com_auth_continue')}
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;

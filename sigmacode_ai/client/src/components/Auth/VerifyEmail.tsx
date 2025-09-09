import { useState, useEffect, useMemo, useCallback } from 'react';
import { Spinner, ThemeSelector } from '@librechat/client';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useVerifyEmailMutation, useResendVerificationEmail } from '~/data-provider';
import { useLocalize } from '~/hooks';

function RequestPasswordReset() {
  const navigate = useNavigate();
  const localize = useLocalize();
  const [params] = useSearchParams();

  const [countdown, setCountdown] = useState<number>(3);
  const [headerText, setHeaderText] = useState<string>('');
  const [showResendLink, setShowResendLink] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<boolean>(false);
  const token = useMemo(() => params.get('token') || '', [params]);
  const email = useMemo(() => params.get('email') || '', [params]);

  const countdownRedirect = useCallback(() => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          navigate('/c/new', { replace: true });
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  }, [navigate]);

  const verifyEmailMutation = useVerifyEmailMutation({
    onSuccess: () => {
      setHeaderText(localize('com_auth_email_verification_success') + ' 🎉');
      setVerificationStatus(true);
      countdownRedirect();
    },
    onError: (error: unknown) => {
      setHeaderText(localize('com_auth_email_verification_failed') + ' 😢');
      setShowResendLink(true);
      setVerificationStatus(true);
    },
  });

  const resendEmailMutation = useResendVerificationEmail({
    onSuccess: () => {
      setHeaderText(localize('com_auth_email_resent_success') + ' 📧');
      countdownRedirect();
    },
    onError: () => {
      setHeaderText(localize('com_auth_email_resent_failed') + ' 😢');
    },
    onMutate: () => setShowResendLink(false),
  });

  const handleResendEmail = () => {
    resendEmailMutation.mutate({ email });
  };

  useEffect(() => {
    if (verificationStatus || verifyEmailMutation.isLoading) {
      return;
    }

    if (token && email) {
      verifyEmailMutation.mutate({ email, token });
    } else {
      if (email) {
        setHeaderText(localize('com_auth_email_verification_failed_token_missing') + ' 😢');
      } else {
        setHeaderText(localize('com_auth_email_verification_invalid') + ' 🤨');
      }
      setShowResendLink(true);
      setVerificationStatus(true);
    }
  }, [token, email, verificationStatus, verifyEmailMutation]);

  const VerificationSuccess = () => (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-4 text-center text-3xl font-semibold text-black dark:text-white">
        {headerText}
      </h1>
      {countdown > 0 && (
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          {localize('com_auth_email_verification_redirecting', { 0: countdown.toString() })}
        </p>
      )}
      {showResendLink && countdown === 0 && (
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          {localize('com_auth_email_verification_resend_prompt')}
          <button
            className="ml-2 inline-flex rounded px-1 text-teal-600 underline-offset-4 hover:text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:text-teal-400 dark:hover:text-teal-300"
            onClick={handleResendEmail}
            disabled={resendEmailMutation.isLoading}
          >
            {localize('com_auth_email_resend_link')}
          </button>
        </p>
      )}
      <div
        className="mt-6 h-px w-full max-w-md rounded-full bg-gradient-to-r from-brand-primary/0 via-brand-primary/40 to-brand-accent/0"
        aria-hidden="true"
      />
      <Link
        to="/login"
        aria-label={localize('com_auth_back_to_login')}
        className="mt-4 block text-center text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
      >
        {localize('com_auth_back_to_login')}
      </Link>
    </div>
  );

  const VerificationInProgress = () => (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-4 text-center text-3xl font-semibold text-black dark:text-white">
        {localize('com_auth_email_verification_in_progress')}
      </h1>
      <div className="mt-4 flex justify-center">
        <Spinner className="h-8 w-8 text-teal-500" />
      </div>
      <div
        className="mt-6 h-px w-full max-w-md rounded-full bg-gradient-to-r from-brand-primary/0 via-brand-primary/40 to-brand-accent/0"
        aria-hidden="true"
      />
      <Link
        to="/login"
        aria-label={localize('com_auth_back_to_login')}
        className="mt-4 block text-center text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded"
      >
        {localize('com_auth_back_to_login')}
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white pt-6 dark:bg-gray-900 sm:pt-0">
      <div className="absolute bottom-0 left-0 m-4">
        <ThemeSelector />
      </div>
      {verificationStatus ? <VerificationSuccess /> : <VerificationInProgress />}
    </div>
  );
}

export default RequestPasswordReset;

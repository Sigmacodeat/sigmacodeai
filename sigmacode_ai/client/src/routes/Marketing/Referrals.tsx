import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, Mail, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Referrals() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loadingCode, setLoadingCode] = useState(true);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState<{
    totalClicks: number;
    totalSignups: number;
    totalConverted: number;
    conversionRate: number;
    rewardsEarned: number;
    rewardsAvailable: number;
    monthBreakdown: { month: string; clicks: number; signups: number; converted: number; rewards: number }[];
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  // Invites
  const [invites, setInvites] = useState<
    { id: string; email: string; status: string; clickedAt: string | null; signedUpAt: string | null; convertedAt: string | null; reward: number }[]
  >([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [errorInvites, setErrorInvites] = useState<string | null>(null);
  
  // Invite Form
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      // Code
      try {
        setLoadingCode(true);
        setErrorCode(null);
        const res = await fetch('/api/referrals/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load referral code');
        const data = await res.json();
        if (!cancelled) {
          setReferralCode(data?.code ?? null);
        }
      } catch (e: any) {
        if (!cancelled) setErrorCode(e?.message || 'Error');
      } finally {
        if (!cancelled) setLoadingCode(false);
      }

      // Stats
      try {
        setLoadingStats(true);
        setErrorStats(null);
        const res = await fetch('/api/referrals/stats', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load referral stats');
        const data = await res.json();
        if (!cancelled) setStats(data);
      } catch (e: any) {
        if (!cancelled) setErrorStats(e?.message || 'Error');
      } finally {
        if (!cancelled) setLoadingStats(false);
      }

      // Invites
      try {
        setLoadingInvites(true);
        setErrorInvites(null);
        const res = await fetch('/api/referrals/invites', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load referral invites');
        const data = await res.json();
        if (!cancelled) setInvites(Array.isArray(data?.items) ? data.items : []);
      } catch (e: any) {
        if (!cancelled) setErrorInvites(e?.message || 'Error');
      } finally {
        if (!cancelled) setLoadingInvites(false);
      }
    };
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const referralUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const base = `${origin}/register`;
    const params = new URLSearchParams({ r: referralCode || '', utm_source: 'referral', utm_medium: 'link' });
    return `${base}?${params.toString()}`;
  }, [referralCode]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success(t('marketing.referrals.copied'));
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      // Fallback: URL in Alert anzeigen
      toast.error(t('marketing.referrals.copy_failed'));
    }
  };

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SIGMACODE AI',
          text: t('marketing.referrals.share_text', { defaultValue: 'Teste SIGMACODE AI mit meinem Empfehlungslink!' }) as string,
          url: referralUrl,
        });
      } catch (e) {
        // Benutzer hat abgebrochen
      }
    } else {
      onCopy();
    }
  };

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setInviteError(t('marketing.referrals.invalid_email'));
      return;
    }
    
    setIsSendingInvite(true);
    setInviteError(null);
    
    try {
      const response = await fetch('/api/referrals/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: inviteEmail }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send invitation');
      }
      
      // Refresh invites list
      fetchInvites();
      setInviteEmail('');
      toast.success(t('marketing.referrals.invite_sent', { email: inviteEmail }));
    } catch (error: any) {
      console.error('Error sending invite:', error);
      setInviteError(error.message || t('marketing.referrals.invite_failed'));
      toast.error(error.message || t('marketing.referrals.invite_failed'));
    } finally {
      setIsSendingInvite(false);
    }
  };

  const fetchInvites = async () => {
    try {
      setLoadingInvites(true);
      setErrorInvites(null);
      const res = await fetch('/api/referrals/invites', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load referral invites');
      const data = await res.json();
      setInvites(Array.isArray(data?.items) ? data.items : []);
    } catch (e: any) {
      setErrorInvites(e?.message || 'Error');
      toast.error(t('marketing.referrals.load_invites_failed'));
    } finally {
      setLoadingInvites(false);
    }
  };

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t('marketing.referrals.title', { defaultValue: 'Empfehlen & verdienen' })}</h1>
        <p className="mt-2 text-text-secondary">
          {t('marketing.referrals.subtitle', { defaultValue: 'Lade Freunde ein. Ihr erhaltet beide Vorteile.' })}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface-primary/60 p-5">
          <h2 className="mb-3 text-lg font-medium">{t('marketing.referrals.your_link', { defaultValue: 'Dein Empfehlungslink' })}</h2>
          {loadingCode ? (
            <div className="text-sm text-text-secondary">{t('marketing.loading', { defaultValue: 'Lade…' })}</div>
          ) : errorCode ? (
            <div className="text-sm text-red-400">{t('marketing.error', { defaultValue: 'Fehler beim Laden.' })}: {errorCode}</div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={referralUrl}
                className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={onCopy}
                disabled={!referralCode}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:opacity-50"
                aria-label={t('marketing.referrals.copy', { defaultValue: 'Link kopieren' }) as string}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">{t('marketing.referrals.copy', { defaultValue: 'Link kopieren' })}</span>
              </button>
              <button
                onClick={onShare}
                disabled={!referralCode}
                className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-teal-500 via-sky-400 to-cyan-300 px-3 py-2 text-sm font-medium text-black shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:opacity-50"
              >
                <Share2 className="h-4 w-4" /> {t('marketing.referrals.share', { defaultValue: 'Teilen' })}
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center">
            <div className="rounded-xl bg-white p-3 shadow">
              <QRCodeSVG value={referralUrl} size={192} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface-primary/60 p-5">
          <h2 className="mb-3 text-lg font-medium">{t('marketing.referrals.how_it_works', { defaultValue: 'So funktioniert\'s' })}</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• {t('marketing.referrals.rule_1', { defaultValue: 'Freund meldet sich über deinen Link an.' })}</li>
            <li>• {t('marketing.referrals.rule_2', { defaultValue: 'Nach dem ersten bezahlten Monat erhaltet ihr beide eine Belohnung.' })}</li>
            <li>• {t('marketing.referrals.rule_3', { defaultValue: 'Missbrauch (Self-Referral) ist ausgeschlossen.' })}</li>
            <li>• {t('marketing.referrals.rule_4', { defaultValue: 'Gültig 90 Tage ab letztem Klick.' })}</li>
          </ul>

          <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
            <p className="font-medium">{t('marketing.referrals.rewards_title', { defaultValue: 'Belohnungen (MVP)' })}</p>
            <p className="mt-2 text-text-secondary">
              {t('marketing.referrals.rewards_text', { defaultValue: 'Neukunde: 1 Gratismonat ODER 15% Rabatt (A/B-Test). Werber: 15% Guthaben, max. 300€ pro Monat.' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8 rounded-2xl border border-border bg-surface-primary/60 p-5">
        <h2 className="mb-3 text-lg font-medium">{t('marketing.referrals.stats_title', { defaultValue: 'Deine Referral-Statistiken' })}</h2>
        {loadingStats ? (
          <div className="text-sm text-text-secondary">{t('marketing.loading', { defaultValue: 'Lade…' })}</div>
        ) : errorStats ? (
          <div className="text-sm text-red-400">{t('marketing.error', { defaultValue: 'Fehler beim Laden.' })}: {errorStats}</div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label={t('marketing.referrals.stat_clicks', { defaultValue: 'Klicks' }) as string} value={stats.totalClicks} />
            <StatCard label={t('marketing.referrals.stat_signups', { defaultValue: 'Anmeldungen' }) as string} value={stats.totalSignups} />
            <StatCard label={t('marketing.referrals.stat_converted', { defaultValue: 'Konvertiert' }) as string} value={stats.totalConverted} />
            <StatCard
              label={t('marketing.referrals.stat_conversion', { defaultValue: 'Conversion' }) as string}
              value={`${Math.round(stats.conversionRate * 1000) / 10}%`}
            />
            <StatCard
              label={t('marketing.referrals.stat_rewards_earned', { defaultValue: 'Verdiente Rewards' }) as string}
              value={`€ ${stats.rewardsEarned.toFixed(2)}`}
            />
            <StatCard
              label={t('marketing.referrals.stat_rewards_available', { defaultValue: 'Verfügbar' }) as string}
              value={`€ ${stats.rewardsAvailable.toFixed(2)}`}
            />
          </div>
        ) : null}
      </div>

      {/* Invites Section */}
      <div className="mt-8 rounded-2xl border border-border bg-surface-primary/60 p-5">
        <h2 className="mb-3 text-lg font-medium">{t('marketing.referrals.invites_title', { defaultValue: 'Einladungen' })}</h2>
        {loadingInvites ? (
          <div className="text-sm text-text-secondary">{t('marketing.loading', { defaultValue: 'Lade…' })}</div>
        ) : errorInvites ? (
          <div className="text-sm text-red-400">{t('marketing.error', { defaultValue: 'Fehler beim Laden.' })}: {errorInvites}</div>
        ) : invites.length === 0 ? (
          <div className="text-sm text-text-secondary">{t('marketing.referrals.invites_empty', { defaultValue: 'Noch keine Einladungen.' })}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-text-secondary">
                  <th className="px-2 py-2">{t('marketing.referrals.inv_email', { defaultValue: 'E-Mail' })}</th>
                  <th className="px-2 py-2">{t('marketing.referrals.inv_status', { defaultValue: 'Status' })}</th>
                  <th className="px-2 py-2">{t('marketing.referrals.inv_clicked', { defaultValue: 'Geklickt' })}</th>
                  <th className="px-2 py-2">{t('marketing.referrals.inv_signed', { defaultValue: 'Registriert' })}</th>
                  <th className="px-2 py-2">{t('marketing.referrals.inv_converted', { defaultValue: 'Konvertiert' })}</th>
                  <th className="px-2 py-2">{t('marketing.referrals.inv_reward', { defaultValue: 'Reward' })}</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((x) => (
                  <tr key={x.id} className="border-b border-border/40">
                    <td className="px-2 py-2">{x.email}</td>
                    <td className="px-2 py-2 capitalize">{x.status.replace('_', ' ')}</td>
                    <td className="px-2 py-2">{formatDate(x.clickedAt)}</td>
                    <td className="px-2 py-2">{formatDate(x.signedUpAt)}</td>
                    <td className="px-2 py-2">{formatDate(x.convertedAt)}</td>
                    <td className="px-2 py-2">{x.reward ? `€ ${x.reward.toFixed(2)}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Form */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">{t('marketing.referrals.invite_friends')}</h3>
        <form onSubmit={sendInvite} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('marketing.referrals.invite_email_label')}
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md sm:text-sm border border-border"
                  placeholder={t('marketing.referrals.invite_email_placeholder')}
                  disabled={isSendingInvite}
                />
              </div>
              <button
                type="submit"
                disabled={!inviteEmail.trim() || isSendingInvite}
                className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-border text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingInvite ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('marketing.referrals.sending')}...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>{t('marketing.referrals.invite_button')}</span>
                  </>
                )}
              </button>
            </div>
            {inviteError && (
              <p className="mt-2 text-sm text-red-600">{inviteError}</p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {t('marketing.referrals.invite_disclaimer')}
          </p>
        </form>
      </div>

      <footer className="mt-8 text-xs text-text-secondary">
        <p>
          {t('marketing.referrals.legal_hint', { defaultValue: 'Es gelten unsere Referral-AGB & Datenschutzbestimmungen.' })}
        </p>
      </footer>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-black/20 p-4">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return '-';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString();
  } catch {
    return '-';
  }
}

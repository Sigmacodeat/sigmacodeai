import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';

export type BrandProps = {
  title?: string;
  to?: string; // if provided, wraps in Link
  className?: string;
  iconSize?: number; // size in px
  glow?: boolean; // subtle glow behind icon
  stacked?: boolean; // icon above text
  // timing controls (seconds)
  iconDelay?: number;
  iconDuration?: number;
  eyesDelay?: number;
  eyesDuration?: number;
  textDelay?: number;
  textDuration?: number;
  strokeWidth?: number; // refine line weight for a more elegant look
  onlyIcon?: boolean; // render only the icon without title
  // callback when all intro animations (including wink) are done
  onReady?: () => void;
  // render instantly without intro animations (used for Skip-Intro / returning users)
  instant?: boolean;
  // when true, suppress the two radial eye-shine circles behind the eyes
  hideEyeShine?: boolean;
  // optional: radius of eye dots (in 24x24 space); default matches login header look
  eyeRadius?: number;
};

export default function Brand({
  title = 'SIGMACODE AI',
  to,
  className,
  iconSize = 24,
  glow = false,
  stacked = false,
  iconDelay = 0,
  iconDuration = 0.6,
  eyesDelay = 0.6,
  eyesDuration = 0.7,
  textDelay = 1.0,
  textDuration = 0.6,
  strokeWidth = 1.6,
  onlyIcon = false,
  onReady,
  instant = false,
  hideEyeShine = false,
  eyeRadius = 1.25,
}: BrandProps) {
  const prefersReduced = useReducedMotion();
  const reduceAll = prefersReduced || instant;
  const readyCalled = useRef(false);
  // Easing & Timing Tokens (konsistent, cinematic)
  const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const EASE_SOFT: [number, number, number, number] = [0.25, 0, 0.2, 1];
  const EASE_SNAPPY: [number, number, number, number] = [0.2, 0, 0.2, 1];
  // Cinematic Sequenz-Timings
  const iconFadeDelay = reduceAll ? 0 : iconDelay;
  const iconFadeDuration = reduceAll ? 0 : Math.max(0.9, iconDuration);
  // sanfter Lift nach oben: etwas längere Bewegungsdauer als das pure Fade
  const moveDuration = reduceAll ? 0 : Math.max(1.05, iconFadeDuration);
  // Überlappter Antennen-Flash kurz vor Ende des Lifts/Fades
  const antennaFlashDelay = reduceAll ? 0 : iconFadeDelay + Math.max(0.7, moveDuration - 0.15);
  const antennaFlashDuration = reduceAll ? 0 : 0.12;
  // Eyes beginnen kurz nach Lift/Fade; kompakt, damit Gesamtablauf kurz bleibt
  const eyesRevealDelay = reduceAll ? 0 : iconFadeDelay + moveDuration + 0.06;
  const eyesRevealDuration = reduceAll ? 0 : Math.max(0.55, eyesDuration);
  const totalIntro = reduceAll
    ? 0
    : eyesRevealDelay + eyesRevealDuration;

  // Ensure onReady also fires in instant/reduced-motion mode where animations have 0 duration
  useEffect(() => {
    if (reduceAll && !readyCalled.current) {
      readyCalled.current = true;
      onReady?.();
    }
    // Only depends on reduceAll; onReady is stable from props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceAll]);

  const Content = (
    <span
      className={[
        'flex items-center gap-2',
        stacked ? 'flex-col' : '',
        className ?? '',
      ].join(' ')}
    >
      <motion.span
        className="relative inline-flex items-center justify-center"
        style={{ width: iconSize, height: iconSize, transformOrigin: '50% 60%', willChange: 'opacity, transform' }}
        initial={{ opacity: reduceAll ? 1 : 0, y: reduceAll ? 0 : 10, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: moveDuration, ease: EASE_SMOOTH, delay: reduceAll ? 0 : iconFadeDelay }}
      >
        {glow && (
          reduceAll ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-sky-300/15 blur-md"
            />
          ) : (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-sky-300/20"
              style={{ filter: 'blur(16px)', willChange: 'opacity, filter', boxShadow: '0 0 48px rgba(125,211,252,0.22), inset 0 0 28px rgba(207,250,254,0.14)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.45, 0.04] }}
              transition={{
                times: [0, 0.8, 1],
                duration: Math.max(1.35, iconFadeDuration + eyesRevealDuration + 0.35),
                ease: EASE_SOFT,
                delay: iconFadeDelay,
              }}
            />
          )
        )}
        <motion.span
          initial={reduceAll ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: moveDuration, ease: EASE_SMOOTH, delay: reduceAll ? 0 : iconFadeDelay }}
          className="contents"
        >
          <Bot
            className=""
            stroke="url(#brandIconGrad)"
            fill="none"
            strokeWidth={strokeWidth}
            width={iconSize}
            height={iconSize}
          >
            <defs>
              <linearGradient id="brandIconGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="55%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#cffafe" />
              </linearGradient>
            </defs>
          </Bot>
        </motion.span>
        {/* Augen- und Effektebene */}
        <motion.svg
          className="absolute inset-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ width: iconSize, height: iconSize }}
        >
          <defs>
            <linearGradient id="brandIconEyesGrad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#cffafe" />
            </linearGradient>
          </defs>
          {/* Antennen-Glow entfernt */}
          {/* Augen erscheinen nach dem Kopf (wie Login-Header), ohne Shine */}
          <motion.g
            initial={reduceAll ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceAll ? 0 : eyesRevealDelay, duration: eyesRevealDuration, ease: EASE_SOFT }}
            onUpdate={() => {
              // noop: reserved for syncing if needed
            }}
            onAnimationComplete={() => {
              if (!readyCalled.current) {
                readyCalled.current = true;
                onReady?.();
              }
            }}
          >
            <circle cx="9" cy="13" r={eyeRadius} fill="url(#brandIconEyesGrad)" />
            <circle cx="15" cy="13" r={eyeRadius} fill="url(#brandIconEyesGrad)" />
          </motion.g>
        </motion.svg>
      </motion.span>
      {!onlyIcon && (
        <motion.span
          initial={reduceAll ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceAll ? 0 : textDuration, ease: [0.22, 1, 0.36, 1], delay: reduceAll ? 0 : (eyesRevealDelay + eyesRevealDuration * 0.35) }}
          className={[
            'text-lg font-semibold tracking-tight',
            stacked ? 'text-center' : '',
            'bg-clip-text text-transparent bg-gradient-to-l from-sky-500 via-sky-300 to-cyan-100',
            reduceAll ? '' : 'brand-gradient--glow-strong is-animated',
          ].join(' ')}
        >
          {title}
        </motion.span>
      )}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="flex items-center gap-2" aria-label="Zur Startseite">
        {Content}
      </Link>
    );
  }

  return Content;
}

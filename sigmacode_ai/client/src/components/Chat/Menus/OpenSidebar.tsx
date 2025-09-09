import { TooltipAnchor } from '@librechat/client';
import { motion } from 'framer-motion';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

export default function OpenSidebar({
  setNavVisible,
  className,
}: {
  setNavVisible: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) {
  const localize = useLocalize();
  return (
    <TooltipAnchor
      description={localize('com_nav_open_sidebar')}
      render={
        <button
          type="button"
          data-testid="open-sidebar-button"
          aria-label={localize('com_nav_open_sidebar')}
          className={cn(
            'group inline-flex items-center justify-center rounded-xl border border-border-light bg-transparent p-2 hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-border/60',
            className,
          )}
          onClick={() =>
            setNavVisible((prev) => {
              localStorage.setItem('navVisible', JSON.stringify(!prev));
              return !prev;
            })
          }
        >
          {/* Custom animated hamburger (gradient strokes, subtle hover motion) */}
          <motion.svg
            className="h-5 w-5 will-change-transform"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            initial={false}
            whileHover={{ scaleX: 1.08 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <defs>
              <linearGradient id="appBurgerGrad" gradientUnits="userSpaceOnUse" x1="24" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <motion.path
              d="M4 7H20"
              stroke="url(#appBurgerGrad)"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: 1 }}
              whileHover={{ pathLength: 1, transition: { duration: 0.5 } }}
            />
            <motion.path
              d="M4 12H20"
              stroke="url(#appBurgerGrad)"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: 1 }}
              whileHover={{ pathLength: 1, transition: { duration: 0.5, delay: 0.03 } }}
            />
            <motion.path
              d="M4 17H20"
              stroke="url(#appBurgerGrad)"
              strokeWidth={2.5}
              strokeLinecap="round"
              initial={{ pathLength: 1 }}
              whileHover={{ pathLength: 1, transition: { duration: 0.5, delay: 0.06 } }}
            />
          </motion.svg>
        </button>
      }
    />
  );
}

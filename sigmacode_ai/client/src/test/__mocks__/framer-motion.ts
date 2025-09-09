// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require('react');

// Simple stable mocks for JSDOM
export const useReducedMotion = (): boolean => false;
export const useInView = (): boolean => true;

// Strip non-DOM motion props to avoid React warnings in tests
const stripMotionProps = (props: any) => {
  // Common framer-motion props that should not reach DOM
  // Keep this list minimal and additive
  const {
    whileInView,
    initial,
    animate,
    exit,
    transition,
    variants,
    viewport,
    layout,
    layoutId,
    whileHover,
    whileTap,
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    onAnimationStart,
    onAnimationComplete,
    onUpdate,
    ...dom
  } = props || {};
  return dom;
};

// Minimal motion proxy: motion.div etc. render as basic elements with forwardRef
export const motion: any = new Proxy(
  {},
  {
    get: (_target, key) => {
      const tag = typeof key === 'string' ? key : 'div';
      return React.forwardRef(function MotionMock(
        { children, ...rest }: any,
        ref: any,
      ) {
        const dom = stripMotionProps(rest);
        return React.createElement(tag as any, { ...dom, ref }, children);
      });
    },
  },
);

// Basic AnimatePresence mock: just render children
export const AnimatePresence = ({ children, ..._rest }: any) =>
  React.createElement(React.Fragment, null, children);

export default { motion, useReducedMotion, useInView, AnimatePresence };

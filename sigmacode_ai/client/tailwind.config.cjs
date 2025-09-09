// const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // Include component library files
    '../packages/client/src/**/*.{js,jsx,ts,tsx}',
  ],
  // Ensure motion utilities are never purged
  safelist: [
    'animate-rise-in',
    'animate-fade-in',
    'animate-scale-in',
    'animate-spring-in',
    'animate-elevation-pop',
    'animate-text-shine',
    'animate-badge-shimmer',
    'animate-float-parallax',
  ],
  // darkMode: 'class',
  darkMode: ['class'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Roboto Mono', 'monospace'],
    },
    // fontFamily: {
    //   sans: ['Söhne', 'sans-serif'],
    //   mono: ['Söhne Mono', 'monospace'],
    // },
    extend: {
      width: {
        authPageWidth: '370px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        // Core motion keyframes (names match CSS in src/styles/motion.keyframes.css)
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        riseIn: {
          '0%': { opacity: 'var(--motion-fade)', transform: 'translateY(var(--motion-rise-y))', filter: 'blur(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        scaleIn: {
          '0%': { opacity: 'var(--motion-fade)', transform: 'scale(var(--motion-scale-sm))' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Advanced motion
        springIn: {
          '0%': { opacity: 'var(--motion-fade)', transform: 'scale(0.96)' },
          '60%': { opacity: '1', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        elevationPop: {
          '0%': { opacity: 'var(--motion-fade)', transform: 'translateY(6px) scale(0.99)', boxShadow: 'var(--elev-shadow-initial)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', boxShadow: 'var(--elev-shadow-final)' },
        },
        textShine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        badgeShimmer: {
          '0%': { backgroundPosition: '-150% 0' },
          '100%': { backgroundPosition: '150% 0' },
        },
        floatParallax: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(4px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        // Base animations
        'fade-in': 'fadeIn var(--motion-dur-sm) var(--motion-ease-out) both',
        'rise-in': 'riseIn var(--motion-dur-sm) var(--motion-ease-out) both',
        'scale-in': 'scaleIn var(--motion-dur-sm) var(--motion-ease-out) both',
        'spring-in': 'springIn var(--motion-dur-sm) var(--motion-ease-emph) both',
        'elevation-pop': 'elevationPop var(--motion-dur-md) var(--motion-ease-smooth) both',
        'text-shine': 'textShine 1.8s linear infinite',
        'badge-shimmer': 'badgeShimmer 1.6s linear infinite',
        'float-parallax': 'floatParallax 6s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-right 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-in-left': 'slide-in-left 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-out-left': 'slide-out-left 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-out-right': 'slide-out-right 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      colors: {
        // Brand tokens (Design Tokens)
        brand: {
          primary: '#14b8a6', // teal-500
          accent: '#06b6d4', // cyan-500
        },
        gray: {
          20: '#ececf1',
          50: '#f7f7f8',
          100: '#ececec',
          200: '#e3e3e3',
          300: '#cdcdcd',
          400: '#999696',
          500: '#595959',
          600: '#424242',
          700: '#2f2f2f',
          800: '#212121',
          850: '#171717',
          900: '#0d0d0d',
        },
        green: {
          50: '#f1f9f7',
          100: '#def2ed',
          200: '#a6e5d6',
          300: '#6dc8b9',
          400: '#41a79d',
          500: '#10a37f',
          550: '#349072',
          600: '#126e6b',
          700: '#0a4f53',
          800: '#06373e',
          900: '#031f29',
        },
        'brand-purple': 'var(--brand-purple)',
        presentation: 'var(--presentation)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-secondary-alt': 'var(--text-secondary-alt)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-warning': 'var(--text-warning)',
        'ring-primary': 'var(--ring-primary)',
        'header-primary': 'var(--header-primary)',
        'header-hover': 'var(--header-hover)',
        'header-button-hover': 'var(--header-button-hover)',
        'surface-active': 'var(--surface-active)',
        'surface-active-alt': 'var(--surface-active-alt)',
        'surface-hover': 'var(--surface-hover)',
        'surface-hover-alt': 'var(--surface-hover-alt)',
        'surface-primary': 'var(--surface-primary)',
        'surface-primary-alt': 'var(--surface-primary-alt)',
        'surface-primary-contrast': 'var(--surface-primary-contrast)',
        'surface-secondary': 'var(--surface-secondary)',
        'surface-secondary-alt': 'var(--surface-secondary-alt)',
        'surface-tertiary': 'var(--surface-tertiary)',
        'surface-tertiary-alt': 'var(--surface-tertiary-alt)',
        'surface-dialog': 'var(--surface-dialog)',
        'surface-submit': 'var(--surface-submit)',
        'surface-submit-hover': 'var(--surface-submit-hover)',
        'surface-destructive': 'var(--surface-destructive)',
        'surface-destructive-hover': 'var(--surface-destructive-hover)',
        'surface-chat': 'var(--surface-chat)',
        'border-light': 'var(--border-light)',
        'border-medium': 'var(--border-medium)',
        'border-medium-alt': 'var(--border-medium-alt)',
        'border-heavy': 'var(--border-heavy)',
        'border-xheavy': 'var(--border-xheavy)',
        /* These are test styles */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ['switch-unchecked']: 'hsl(var(--switch-unchecked))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        /**
         * Arctic Light palette (state-of-the-art, subtle blue on white)
         * Avoids purple/turquoise, focuses on refined azure tints.
         */
        arctic: {
          primary: '#6AA8FF',
          weak: '#A9C9FF',
          tint: '#DDEBFF',
          accent: '#2E6EF7',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F7F9FC',
        },
        neutralx: {
          900: '#0B1220',
          700: '#111827',
          500: '#384151',
          300: '#CBD5E1',
          200: '#E5EAF2',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        glow: '0 10px 40px rgba(106,168,255,0.18)',
        keyline: '0 0 0 1px rgba(203,213,225,0.6)',
      },
      backgroundImage: {
        'hero-arctic':
          'radial-gradient(1200px 600px at 70% -10%, rgba(106,168,255,0.20) 0%, rgba(106,168,255,0.00) 60%),\n          radial-gradient(800px 400px at 10% 20%, rgba(221,235,255,0.35) 0%, rgba(221,235,255,0.00) 60%),\n          linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-radix'),
    // require('@tailwindcss/typography'),
  ],
};

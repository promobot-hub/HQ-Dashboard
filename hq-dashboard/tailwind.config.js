/**** Tailwind CSS v4 Config for Clawbot HQ (Dark Premium) ****/
/** Note: Tailwind v4 uses the new config schema; this file is compatible with v3+ syntax and migrates easily. */

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
    './pages_legacy.disabled/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0a0a0a', // deep background
          50: '#0a0a0a',
          100: '#111111',
          200: '#1a1a1a',
          300: '#222222',
        },
        text: {
          high: 'rgba(255,255,255,0.95)',
          med: 'rgba(255,255,255,0.75)',
          low: 'rgba(255,255,255,0.55)',
        },
        accent: {
          cyan: '#22d3ee',
          violet: '#a855f7',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        glass: 'rgba(255,255,255,0.06)',
        hairline: 'rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(90deg, #22d3ee 0%, #a855f7 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        neu: 'inset 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.35)',
        glow: '0 0 0 2px rgba(34,211,238,0.2), 0 0 40px rgba(168,85,247,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Satoshi',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
        display: [
          'Satoshi',
          'Inter',
          'ui-sans-serif',
          'system-ui',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
};

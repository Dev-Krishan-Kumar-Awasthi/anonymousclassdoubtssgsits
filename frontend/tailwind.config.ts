import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          deep: '#123B6D',
        },
        primary: {
          DEFAULT: '#1769AA',
          light: '#EAF3FB',
          dark: '#123B6D',
        },
        background: '#F6F8FB',
        text: {
          main: '#172033',
          muted: '#667085',
        },
        status: {
          success: '#198754',
          warning: '#D98C00',
          danger: '#C62828',
        },
      },
      boxShadow: {
        institutional: '0 1px 3px rgba(11, 31, 58, 0.08), 0 1px 2px rgba(11, 31, 58, 0.04)',
        'institutional-md': '0 4px 6px -1px rgba(11, 31, 58, 0.08), 0 2px 4px -1px rgba(11, 31, 58, 0.04)',
        'institutional-lg': '0 10px 15px -3px rgba(11, 31, 58, 0.08), 0 4px 6px -2px rgba(11, 31, 58, 0.04)',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        don: '#FF4444',
        ka: '#4488FF',
        perfect: '#00FF88',
        good: '#FFAA00',
        miss: '#FF3333',
        accent: '#FFD700',
      },
      animation: {
        'ripple': 'ripple 0.6s ease-out',
        'note-hit': 'noteHit 0.3s ease-out',
        'drum-hit': 'drumHit 0.15s ease-out',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        noteHit: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        drumHit: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

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
        'particle-burst': 'particleBurst 0.6s ease-out forwards',
        'combo-milestone': 'comboMilestone 2s ease-out forwards',
        'firework': 'firework 1s ease-out forwards',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'float-particle': 'floatParticle 20s ease-in-out infinite',
        'fall-petal': 'fallPetal 15s linear infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'pulse-combo': 'pulseCombo 0.5s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
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
        particleBurst: {
          '0%': {
            transform: 'translate(-50%, -50%) translate(0, 0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translate(-50%, -50%) translate(var(--particle-vx), var(--particle-vy)) scale(0)',
            opacity: '0',
          },
        },
        comboMilestone: {
          '0%': {
            transform: 'scale(0)',
            opacity: '0',
          },
          '30%': {
            transform: 'scale(1.2)',
            opacity: '1',
          },
          '70%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
        },
        firework: {
          '0%': {
            transform: 'translate(-50%, -50%) translate(0, 0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translate(-50%, -50%) translate(var(--firework-x), var(--firework-y)) scale(0)',
            opacity: '0',
          },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floatParticle: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0.3' },
          '25%': { transform: 'translate(10px, -20px) rotate(90deg)', opacity: '0.6' },
          '50%': { transform: 'translate(-10px, -40px) rotate(180deg)', opacity: '0.9' },
          '75%': { transform: 'translate(10px, -20px) rotate(270deg)', opacity: '0.6' },
        },
        fallPetal: {
          '0%': {
            transform: 'translateY(0) translateX(0) rotate(0deg)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(120vh) translateX(var(--drift-x)) rotate(360deg)',
            opacity: '0',
          },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scaleX(1)' },
          '50%': { opacity: '1', transform: 'scaleX(1.2)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        pulseCombo: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

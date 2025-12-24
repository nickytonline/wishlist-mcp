import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        winter: {
          'ice-blue': '#0277bd',
          'ice-blue-bright': '#4fc3f7',
          'deep-blue': '#1a1a2e',
          'midnight-blue': '#16213e',
          'ocean-blue': '#0f3460',
          'frost-white': '#f8f9fa',
          'snow-white': '#ffffff',
          'warm-orange': '#ff6f3c',
          'cozy-red': '#ef5350',
          'soft-green': '#66bb6a',
          'soft-purple': '#7b1fa2',
          'soft-purple-bright': '#ba68c8',
        },
      },
      backgroundImage: {
        'winter-gradient': 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #e1f5fe 100%)',
        'winter-card': 'linear-gradient(135deg, rgba(79, 195, 247, 0.1), rgba(186, 104, 200, 0.1))',
      },
    },
  },
  plugins: [],
} satisfies Config;

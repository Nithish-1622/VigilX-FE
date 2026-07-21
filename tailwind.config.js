/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      colors: {
        // VigilX Government Design System
        vigilx: {
          // Background layers
          bg:         '#07090f',
          surface:    '#0d1117',
          raised:     '#111827',
          // Borders
          borderMuted:  '#1e2d3d',
          borderActive: '#1e3a6e',
          // Brand
          primary:      '#2563eb',
          primaryHover: '#1d4ed8',
          primaryMuted: '#1e3a6e',
          // Text
          textPrimary:  '#f1f5f9',
          textMuted:    '#64748b',
          textDim:      '#334155',
          // Semantic
          success:  '#16a34a',
          warning:  '#ca8a04',
          danger:   '#dc2626',
          // Legacy aliases (backward compat)
          card:         '#0d1117',
          borderColor:  '#1e2d3d',
        },
        // Shadcn-compatible semantic tokens
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius))',
        sm: 'calc(var(--radius))',
      },
      boxShadow: {
        'vx-sm':  '0 1px 3px rgba(0, 0, 0, 0.4)',
        'vx-md':  '0 4px 12px rgba(0, 0, 0, 0.5)',
        'vx-lg':  '0 8px 24px rgba(0, 0, 0, 0.6)',
        'vx-ai':  '0 0 0 1px rgba(37, 99, 235, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

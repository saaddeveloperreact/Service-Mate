/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ["'Playfair Display'", 'serif'],
        body:    ["'DM Sans'", 'sans-serif'],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        blob:    { '0%':{ transform:'translate(0px,0px) scale(1)' }, '33%':{ transform:'translate(30px,-50px) scale(1.1)' }, '66%':{ transform:'translate(-20px,20px) scale(0.9)' }, '100%':{ transform:'translate(0px,0px) scale(1)' } },
        float:   { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-12px)' } },
        shimmer: { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        blob:    'blob 7s infinite',
        float:   'float 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

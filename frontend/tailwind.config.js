/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        // Zone-specific colors with gradients
        zones: {
          read: {
            DEFAULT: "var(--read-accent)",
            from: "var(--read-gradient-from)",
            to: "var(--read-gradient-to)"
          },
          coach: {
            DEFAULT: "var(--coach-accent)",
            from: "var(--coach-gradient-from)",
            to: "var(--coach-gradient-to)"
          },
          player: {
            DEFAULT: "var(--player-accent)",
            from: "var(--player-gradient-from)",
            to: "var(--player-gradient-to)"
          },
          series: {
            DEFAULT: "var(--series-accent)",
            from: "var(--series-gradient-from)",
            to: "var(--series-gradient-to)"
          },
          courses: {
            DEFAULT: "var(--courses-accent)",
            from: "var(--courses-gradient-from)",
            to: "var(--courses-gradient-to)"
          },
          admin: {
            DEFAULT: "var(--admin-accent)",
            from: "var(--admin-gradient-from)",
            to: "var(--admin-gradient-to)"
          },
        },
        // Semantic colors
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        // Typography colors from design system
        heading: "var(--heading-color)",
        text: "var(--text-color)",
        'text-body': "var(--text-body)",
        'text-muted': "var(--text-muted)",
        'text-light': "var(--text-light)",
        // Component colors
        card: {
          DEFAULT: "var(--card-background)",
          border: "var(--card-border)",
        },
        input: {
          DEFAULT: "var(--input-background)",
          border: "var(--input-border)",
        },
      },
      boxShadow: {
        'sm': "var(--shadow-sm)",
        'DEFAULT': "var(--shadow)",
        'md': "var(--shadow-md)",
        'lg': "var(--shadow-lg)",
        'xl': "var(--shadow-xl)",
        'button': "var(--button-shadow)",
      },
      borderRadius: {
        'sm': "var(--radius-sm)",
        'DEFAULT': "var(--radius)",
        'md': "var(--radius-md)",
        'lg': "var(--radius-lg)",
        'xl': "var(--radius-xl)",
      },
      transitionDuration: {
        'fast': "var(--transition-fast)",
        'normal': "var(--transition-normal)",
        'slow': "var(--transition-slow)",
      },
      animation: {
        'slide-up': 'slideUp 0.8s ease-out',
        'fade-in-delayed': 'fadeInDelayed 1s ease-out 0.3s both',
        'fade-in-delayed-2': 'fadeInDelayed 1s ease-out 0.6s both',
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'scale-in': 'scaleIn 0.5s ease-out both',
        'slide-in-left': 'slideInLeft 0.6s ease-out both',
        'slide-in-right': 'slideInRight 0.6s ease-out both',
        'slide-in-down': 'slideInDown 0.6s ease-out both',
        'slide-in-up': 'slideInUp 0.6s ease-out both',
        'bounce-in': 'bounceIn 0.75s ease-out both',
        'fade-in-scale': 'fadeInScale 0.5s ease-out both',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
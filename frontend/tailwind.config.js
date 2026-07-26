/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 中性色 - 温暖墨色（zinc 系），取代冷调 slate/gray
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b'
        },
        // 主色调 - 电光群青 Ultramarine
        primary: {
          50: '#f0f3ff',
          100: '#e2e8ff',
          200: '#cad4ff',
          300: '#a8b6fe',
          400: '#8391fb',
          500: '#5f66f5',
          600: '#4a45e8',
          700: '#3d37cc',
          800: '#322fa4',
          900: '#2d2d82',
          950: '#1b1a4c'
        },
        // 辅助色 - 墨色中性
        accent: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b'
        },
        // 深色模式背景 - 墨黑
        dark: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#232327',
          900: '#161619',
          950: '#0b0b0e'
        },
        // 信号色 - 荧光信号绿（装饰性点缀，深底浅字场景）
        signal: {
          200: '#e9fbc2',
          300: '#d9f99d',
          400: '#bef264',
          500: '#a3e635',
          600: '#84cc16',
          700: '#65a30d'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Noto Sans SC',
          'sans-serif'
        ],
        display: [
          'Space Grotesk',
          'Inter',
          'system-ui',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Noto Sans SC',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        glass: '0 8px 32px rgba(9, 9, 11, 0.08)',
        'glass-sm': '0 4px 16px rgba(9, 9, 11, 0.06)',
        glow: '0 0 20px rgba(95, 102, 245, 0.25)',
        'glow-lg': '0 0 40px rgba(95, 102, 245, 0.35)',
        'glow-signal': '0 0 24px rgba(163, 230, 53, 0.3)',
        card: '0 1px 2px rgba(9, 9, 11, 0.04), 0 1px 3px rgba(9, 9, 11, 0.05)',
        'card-hover': '0 12px 32px -8px rgba(9, 9, 11, 0.12)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        pop: '0 2px 4px rgba(9, 9, 11, 0.04), 0 12px 40px -8px rgba(9, 9, 11, 0.16)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #5f66f5 0%, #4a45e8 100%)',
        'gradient-dark': 'linear-gradient(135deg, #232327 0%, #0b0b0e 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'mesh-gradient':
          'radial-gradient(at 40% 20%, rgba(95, 102, 245, 0.10) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(163, 230, 53, 0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(95, 102, 245, 0.06) 0px, transparent 50%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        marquee: 'marquee 32s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(95, 102, 245, 0.25)' },
          '100%': { boxShadow: '0 0 30px rgba(95, 102, 245, 0.4)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snap: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: []
}

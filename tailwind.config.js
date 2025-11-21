/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'learner-red': '#D7171F',
        'dark': '#1a1a1a',
        'medium-grey': '#6B6B6B',
        'light-grey': '#F5F5F5',
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'slide-down': 'slideDown 1.5s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideDown: {
          'from': { height: '0' },
          'to': { height: '60%' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      clipPath: {
        'diagonal': 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        'diagonal-reverse': 'polygon(0 0, 100% 0, 100% 100%, 0 85%)',
      },
    },
  },
  plugins: [],
}

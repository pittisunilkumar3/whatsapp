/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'whatsapp-green': '#075E54',
        'light-whatsapp-green': '#3CBC8D',
        'neon-green': '#66BB6A',
        
        // Text Colors
        'primary-text': '#333333',
        'secondary-text': '#666666',
        
        // Background Colors
        'secondary-gray': '#F0F0F0',
        
        // Status Colors
        'status-active': '#4CAF50',
        'status-inactive': '#9E9E9E',
        'status-warning': '#FFC107',
        'status-error': '#F44336',
        
        // Channel Colors
        'sms-purple': '#9C27B0',
        'voice-orange': '#FF9800',
        'email-blue': '#2196F3',
        
        // Accent Colors
        'neon-blue': '#4FC3F7',
      },
      fontFamily: {
        'sans': ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          'to': {
            opacity: '0.6',
          },
        },
      },
      boxShadow: {
        'neon': '0 0 10px var(--tw-shadow-color)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
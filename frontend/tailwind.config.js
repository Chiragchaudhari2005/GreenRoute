/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4CAF4F',
          secondary: '#263238',
          info: '#2194F2',
          black: '#263238',
          dGrey: '#4D4D4D',
          grey: '#717171',
          lGrey: '#89939E',
          greyBlue: '#ABBED1',
          silver: '#F5F7FA',
          white: '#FFFFFF',
          // Shades
          shade1: '#43A046',
          shade2: '#388E3C',
          shade3: '#2E7D32',
          shade4: '#1B5E1F',
          shade5: '#103E12',
          // Tints
          tint1: '#66BB69',
          tint2: '#81C784',
          tint3: '#A5D6A7',
          tint4: '#C8E6C9',
          tint5: '#E8F5E9',
          // Action
          warning: '#FBC02D',
          error: '#E53835',
          success: '#2E7D32',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(171, 190, 209, 0.2), 0 4px 16px rgba(171, 190, 209, 0.1)',
        cardHover: '0 10px 25px -5px rgba(38, 50, 56, 0.08), 0 8px 10px -6px rgba(38, 50, 56, 0.05)',
      },
    },
  },
  plugins: [],
}

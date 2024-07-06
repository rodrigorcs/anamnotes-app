/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: ['./src/**/*.{jsx,tsx,js,ts}'],
  theme: {
    colors: {
      'brand-900': '#03133A',
      'brand-700': '#052269',
      'brand-500': '#0A43CC',
      'brand-300': '#A3BEFF',
      'brand-100': '#E0E9FF',

      'feedback-positive-500': '#00472D',
      'feedback-positive-300': '#1E8560',
      'feedback-positive-100': '#E0FFF4',

      'feedback-negative-500': '#520013',
      'feedback-negative-300': '#CC153F',
      'feedback-negative-100': '#FFE0E8',

      'feedback-info-500': '#004C52',
      'feedback-info-300': '#138991',
      'feedback-info-100': '#E0FDFF',

      'neutrals-900': '#171B21',
      'neutrals-800': '#2B2F36',
      'neutrals-700': '#43464D',
      'neutrals-600': '#5C6069',
      'neutrals-500': '#6C717A',
      'neutrals-400': '#A0A4AD',
      'neutrals-300': '#C1C4C9',
      'neutrals-200': '#D7DBE0',
      'neutrals-100': '#F0F1F5',
      'neutrals-white': '#FFFFFF',
      'neutrals-black': '#000000',

      'background-200': '#EDEFFD',
      'background-100': '#F9FAFE',
      'background-white': '#FFFFFF',
    },
  },
  plugins: [],
}

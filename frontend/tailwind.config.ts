import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        'neon-blue': '#00f3ff',
        'neon-purple': '#b026ff',
        'neon-cyan': '#00ffff',
        'cs-dark': '#0a0a0a',
      },
    },
  },
  plugins: [],
}

export default config 
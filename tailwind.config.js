// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'form-card-bg': '#131a2e',      
        'particle-bg': '#1a1a2e',       
      },
    },
  },
  plugins: [],
}
module.exports = {
  darkMode: 'class',
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
  plugins: [
    require ('daisyui'),
  ],
  
  daisyui: {
    themes: [
      "light",  // default light theme
      "dark",   // default dark theme
      "corporate", 
      "forest",   
    ],
    darkTheme: "dark", 
    base: true,
    styled: true,
    utils: true,
    logs: true,
  },
};
const colors = require("./constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        "Roobert-Regular": ["Roobert-Regular"],
        "Roobert-RegularItalic": ["Roobert-RegularItalic"],
        "Roobert-Medium": ["Roobert-Medium"],
        "Roobert-MediumItalic": ["Roobert-MediumItalic"],
        "Roobert-SemiBold": ["Roobert-SemiBold"],
        "Roobert-SemiBoldItalic": ["Roobert-SemiBoldItalic"],
        "Roobert-Bold": ["Roobert-Bold"],
        "Roobert-BoldItalic": ["Roobert-BoldItalic"],
        "Roobert-Heavy": ["Roobert-Heavy"],
        "Roobert-HeavyItalic": ["Roobert-HeavyItalic"],
        "Roobert-Light": ["Roobert-Light"],
        "Roobert-LightItalic": ["Roobert-LightItalic"],
      },
    },
  },
  plugins: [],
};

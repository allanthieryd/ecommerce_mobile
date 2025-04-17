/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[500],
        secondary: colors.blue[700],
        bg: {
          default: colors.slate[950],
          alt: colors.slate[800],
        },
        fg: {
          default: colors.white,
          alt: colors.slate[200],
        },
        error: colors.red[500],
        success: colors.green[500],
        warning: colors.yellow[500],
      },
      fontFamily: {
        Varela_Round: ["VarelaRound_400Regular"],
        Ubuntu_Mono: ["UbuntuMono_400Regular"],
        Ubuntu_Mono_Bold: ["UbuntuMono_700Bold"],
        Rubik: ["Rubik_400Regular"],
        Rubik_Bold: ["Rubik_700Bold"],
      },
      animation: {
        slow_spin: "spin 5s linear infinite",
      },
    },
  },
  plugins: [],
};

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const ICON_COLORS: Record<
  string,
  {
    color: string;
    className: {
      backgroundColor: string;
      border: string;
      darkerBackgroundColor: string;
    };
  }
> = {
  lightBlue: {
    color: "#2AA8CF",
    className: {
      backgroundColor: "bg-[#2AA8CF]",
      border: "border-[#2AA8CF]",
      darkerBackgroundColor: "bg-[#2AA8CF]/20",
    },
  },
  blue: {
    color: "#2A67F5",
    className: {
      backgroundColor: "bg-[#2A67F5]",
      border: "border-[#2A67F5]",
      darkerBackgroundColor: "bg-[#2A67F5]/20",
    },
  },
  green: {
    color: "#299240",
    className: {
      backgroundColor: "bg-[#299240]",
      border: "border-[#299240]",
      darkerBackgroundColor: "bg-[#299240]/20",
    },
  },
  yellow: {
    color: "#E1861D",
    className: {
      backgroundColor: "bg-[#E1861D]",
      border: "border-[#E1861D]",
      darkerBackgroundColor: "bg-[#E1861D]/20",
    },
  },
  red: {
    color: "#D42C2C",
    className: {
      backgroundColor: "bg-[#D42C2C]",
      border: "border-[#D42C2C]",
      darkerBackgroundColor: "bg-[#D42C2C]/20",
    },
  },
  purple: {
    color: "#982ABF",
    className: {
      backgroundColor: "bg-[#982ABF]",
      border: "border-[#982ABF]",
      darkerBackgroundColor: "bg-[#982ABF]/20",
    },
  },
};

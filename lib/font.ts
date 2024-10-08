import { Platform } from "react-native";
export const fontFamily = Platform.select({
  android: {
    openSans: {
      light: "OpenSans_300Light",
      regular: "OpenSans_400Regular",
      medium: "OpenSans_500Medium",
      semiBold: "OpenSans_600SemiBold",
      bold: "OpenSans_700Bold",
      extraBold: "OpenSans_800ExtraBold",
    },
  },
  ios: {
    openSans: {
      light: "OpenSans-Light",
      regular: "OpenSans-Regular",
      medium: "OpenSans-Medium",
      semiBold: "OpenSans-SemiBold",
      bold: "OpenSans-Bold",
      extraBold: "OpenSans-ExtraBold",
    },
  },
  default: {
    openSans: {
      light: "OpenSans_300Light",
      regular: "OpenSans_400Regular",
      medium: "OpenSans_500Medium",
      semiBold: "OpenSans_600SemiBold",
      bold: "OpenSans_700Bold",
      extraBold: "OpenSans_800ExtraBold",
    },
  },
});

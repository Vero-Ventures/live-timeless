const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.VeroVentures.LiveTimeless.dev";
  }

  if (IS_PREVIEW) {
    return "com.VeroVentures.LiveTimeless.preview";
  }

  return "com.VeroVentures.LiveTimeless";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Live Timeless (Dev)";
  }

  if (IS_PREVIEW) {
    return "Live Timeless (Preview)";
  }

  return "Live Timeless";
};

export default {
  expo: {
    owner: "live-timeless",
    name: getAppName(),
    slug: "live-timeless-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "live-timeless",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#082139",
      },
      package: getUniqueIdentifier(),
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#082139",
          image: "./assets/logo.png",
          dark: {
            image: "./assets/logo.png",
            backgroundColor: "#082139",
          },
          imageWidth: 200,
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "node_modules/@expo-google-fonts/open-sans/OpenSans_300Light.ttf",
            "node_modules/@expo-google-fonts/open-sans/OpenSans_400Regular.ttf",
            "node_modules/@expo-google-fonts/open-sans/OpenSans_500Medium.ttf",
            "node_modules/@expo-google-fonts/open-sans/OpenSans_600SemiBold.ttf",
            "node_modules/@expo-google-fonts/open-sans/OpenSans_700Bold.ttf",
            "node_modules/@expo-google-fonts/open-sans/OpenSans_800ExtraBold.ttf",
          ],
        },
      ],
      [
        "expo-asset",
        {
          assets: ["./assets/images/onboarding.jpg"],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "bcce0143-5443-475c-a2f1-17a28f176ad2",
      },
    },
  },
};

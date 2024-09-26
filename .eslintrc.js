// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  plugins: ["react", "react-native"],
  rules: {
    "react-native/no-unused-styles": "error",
    "react/jsx-no-leaked-render": [
      "error",
      { validStrategies: ["coerce", "ternary"] },
    ],
  },
};

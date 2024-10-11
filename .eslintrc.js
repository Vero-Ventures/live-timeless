// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  plugins: ["react", "react-native"],
  parser: "@typescript-eslint/parser",
  rules: {
    "react-native/no-unused-styles": "error",
    "react/jsx-no-leaked-render": [
      "error",
      { validStrategies: ["coerce", "ternary"] },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "separate-type-imports" },
    ],
  },
};

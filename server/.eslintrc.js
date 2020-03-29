module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
      "airbnb-base",
      "plugin:import/errors",
      "plugin:import/warnings",
      "prettier",
      "prettier/@typescript-eslint"
  ],
  plugins: [
      "import",
      "jest",
      "prettier",
      "@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
      "es6": true,
      "node": true,
      "jest": true
  },
  settings: {
      "import/resolver": {
          "node": {
              "extensions": [".js",".ts"]
          }
      }
  },
  rules: {
    "prettier/prettier": ["error", {"parser": "typescript"}],
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies" : ["**/*.test.ts", "**/*.spec.ts"] }],
    "import/extensions": ["error", "never"],
    "@typescript-eslint/explicit-function-return-type": 0
  },
};

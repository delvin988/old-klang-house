module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2020,
        sourceType: "module",
    },
    plugins: ["react"],
    settings: {
        react: { version: "detect" },
    },
    rules: {
        "react/react-in-jsx-scope": "off",
    },
    ignorePatterns: ["build", "node_modules", "*.config.js", "src/**/*.ts", "src/**/*.tsx"],
};

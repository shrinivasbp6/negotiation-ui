module.exports = {
  // Other ESLint configurations...
  plugins: ["react", "react-hooks"],
  rules: {
    // Other ESLint rules...
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
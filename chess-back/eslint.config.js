module.exports = [
    {
      ignores: ["node_modules/**"],
      files: ["**/*.js", "**/*.ts"],
      languageOptions: {
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
        },
      },
    },
  ];
  
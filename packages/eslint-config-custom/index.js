// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "keyword-spacing": ["error", { before: true, after: true }],
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "no-async-promise-executor": 0,
    "no-restricted-syntax": ["off", "ForOfStatement"],
    "@typescript-eslint/comma-dangle": ["error", "never"],
    "@typescript-eslint/lines-between-class-members": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        functions: false,
        variables: false
      }
    ],
    "class-methods-use-this": "off",
    "func-names": "off",
    "import/prefer-default-export": "off",
    "linebreak-style": "off",
    "lines-between-class-members": "off",
    "max-len": [
      "error",
      {
        code: 160,
        tabWidth: 2
      }
    ],
    "no-continue": "off",
    "no-multi-spaces": ["warn", { exceptions: { VariableDeclarator: true } }],
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-underscore-dangle": "off",
    "object-curly-newline": "off",
    "prefer-destructuring": "off",
    "prefer-object-spread": "off",
    "promise/no-promise-in-callback": "off"
  }
};

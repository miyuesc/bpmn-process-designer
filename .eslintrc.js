module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser"
  },
  rules: {
    "prettier/prettier": [
      "warn",
      {
        singleQuote: false, // 不使用单引号
        printWidth: 120, // 换行字符串阈值
        semi: true, // 句末加分号
        trailingComma: "none" // 最后一个对象元素加逗号
      }
    ],
    "vue/no-mutating-props": 0,
    "linebreak-style": 0,
    "no-unused-vars": 0,
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};

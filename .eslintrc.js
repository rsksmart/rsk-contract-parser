module.exports = {
  plugins: [
    'json',
    'mocha'
  ],
  extends: ['standard', 'plugin:json/recommended'],
  env: {
    node: true,
    mocha: true,
    es2020: true
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    requireConfigFile: false
  },
  rules: {
    camelcase: 'off'
  }
}

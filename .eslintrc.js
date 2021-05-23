module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 8
  },
  rules: {
    'no-console': 2
  },
  globals: {
    Promise: 'readonly'
  }
}

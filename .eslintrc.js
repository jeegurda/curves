module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      impliedStrict: true
    }
  },
  globals: {
    process: false
  },
  parser: 'babel-eslint',
  plugins: ['react'],
  extends: ['standard'],
  rules: {
    // prevents React component names being marked as unused when used like "<Component ..."
    'react/jsx-uses-vars': 2,
    // prevents imported "React" variable being marked as unused when using jsx notation
    'react/jsx-uses-react': 2,

    // 'prefer-const': 2,
  }
};

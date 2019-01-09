// Babel configuration
// https://babeljs.io/docs/usage/api/
module.exports = {
  presets: [
      '@babel/preset-env',
  ],
  plugins: [
      "add-module-exports"
  ],
  ignore: ['node_modules'],
};

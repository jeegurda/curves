const webpack = require('webpack');

module.exports = {
  // Webpack entry config property in an object format
  // https://webpack.js.org/configuration/entry-context/#entry
  // It's used for both dev-server and prod build
  js: {
    'index': './src/index.js',
  },
  // HtmlWebpackPlugin config in a "filename: template" format
  html: {
    'index.html': './public/index.html',
  },
  // CommonsChunkPlugins, these get merged into a "plugin" value of webpack config
  commons: [
  ]
}

const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/i,
        loader: 'vue-loader'
      }
    ],
  },

  plugins: [
    new VueLoaderPlugin()
  ],

  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.ts'],
  },

  devServer: {
    contentBase: [
      './build'
    ],
  },
}

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const prodBuild = (process.env.force_build || process.env.build) === 'prod'

module.exports = {
  mode: prodBuild ? 'production' : 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          prodBuild ? MiniCssExtractPlugin.loader : 'style-loader',
          { loader: 'css-loader', options: { modules: { mode: 'local' } } },
          'sass-loader',
        ],
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

  plugins: [
    ...(prodBuild ? [new MiniCssExtractPlugin()] : []),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  devtool: prodBuild ? 'source-map' : 'eval-source-map',

  devServer: {
    static: {
      directory: './build',
    },
  },
}

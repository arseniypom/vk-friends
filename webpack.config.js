const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let rules = require('./webpack.config.rules')();
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
console.log('isDev:', isDev);

rules.push({
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader']
});

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  output: {
    filename: '[name]_[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: isDev
  },
  module: { rules },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.hbs',
      title: 'YMaps'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash].css'
    }),
    new CleanWebpackPlugin(),
  ],
}
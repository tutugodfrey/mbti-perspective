const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    entry: './client/index.js',
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.(scss|sass)$/,
          use: ['style-loader', 'css-loader?url=false', 'sass-loader'],
          exclude: /node_modules/
        }
      ]
    },
    devServer: {
      inline: true,
      port: 3001,
      historyApiFallback: true,
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./client/index.html')
      })
    ]
  }
};

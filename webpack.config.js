const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    entry: './index.js',
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
    // optimization: {
    //   minimizer: [
    //     new UglifyJsPlugin({
    //       cache: true,
    //       parallel: true,
    //       uglifyOptions: {
    //         compress: false,
    //         ecma: 6,
    //         mangle: true,
    //       },
    //       sourceMap: true
    //     })
    //   ]
    // },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('./index.html')
      })
    ]
  }
};

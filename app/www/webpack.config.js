const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./react-app/index.jsx'],
  output: {
    path: path.join(__dirname),
    filename: 'bundle.js',
  },
  postcss() {
    return [autoprefixer, precss];
  },
  module: {
    loaders: [
      // js[x]
      { test: /\.jsx?$/, include: path.join(__dirname, 'react-app'), loader: 'babel-loader' },

      // css
      { test: /\.css$/, loader: 'style-loader!css-loader' },

      // fonts
      { test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=static/[name].[ext]' },

      // less
      { test: /\.less$/, loader: 'style-loader!css-loader!postcss-loader!less-loader' },
    ],
  },
};

// depending on the arguments passes we'll be adding specific
// plugins to webpack else we'll have production build even on webpack dev server
if (process.argv.indexOf('-p') > -1) {
  module.exports.devtool = '#source-map';
  module.exports.plugins = [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'react-app/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ];
} else {
  module.exports.plugins = [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'react-app/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ];
}

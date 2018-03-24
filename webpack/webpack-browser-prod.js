const helpers = require('./commons/helpers');
const webpackProd = require('./commons/webpack-common-prod.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = webpackMerge(webpackProd, {
  output: {
    path: helpers.root('/dist/browser'),
    filename: 'ayro.min.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CHANNEL: '"website"',
      },
    }),
    new CleanPlugin(['dist/browser'], {root: helpers.root('')}),
  ],
});

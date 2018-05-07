'use strict';

const helpers = require('./commons/helpers');
const webpackDev = require('./commons/webpack-common-dev');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = webpackMerge(webpackDev, {
  output: {
    path: helpers.root('/dist/wordpress'),
    filename: 'ayro-wordpress.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CHANNEL: '"wordpress"',
      },
    }),
    new CleanPlugin(['dist/wordpress'], {root: helpers.root('')}),
  ],
});

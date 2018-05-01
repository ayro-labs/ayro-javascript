'use strict';

const helpers = require('./commons/helpers');
const webpackDev = require('./commons/webpack-common-dev');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = webpackMerge(webpackDev, {
  output: {
    path: helpers.root('/lib'),
    filename: 'ayro.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CHANNEL: '"website"',
      },
    }),
    new CleanPlugin(['lib'], {root: helpers.root('')}),
  ],
});

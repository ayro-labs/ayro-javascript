'use strict'

const helpers = require('./commons/helpers');
const webpackProd = require('./commons/webpack.common.prod.js');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = webpackMerge(webpackProd, {
  output: {
    path: helpers.root('lib'),
    filename: 'chatz.js',
  },
  plugins: [
    new CleanPlugin(['lib'], {root: helpers.root('')}),
  ],
});

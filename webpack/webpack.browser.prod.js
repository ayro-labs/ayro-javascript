'use strict'

const helpers = require('./helpers');
const webpackProd = require('./webpack.prod.js');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackProd, {
  output: {
    path: helpers.root('dist'),
    filename: 'chatz.min.js',
  },
});
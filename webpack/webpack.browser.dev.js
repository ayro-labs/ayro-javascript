'use strict'

const helpers = require('./helpers');
const webpackDev = require('./webpack.dev.js');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackDev, {
  output: {
    path: helpers.root('dist'),
    filename: 'chatz.js',
  },
});
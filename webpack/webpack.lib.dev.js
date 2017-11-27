const helpers = require('./commons/helpers');
const webpackDev = require('./commons/webpack.common.dev.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = webpackMerge(webpackDev, {
  output: {
    path: helpers.root('lib'),
    filename: 'ayro.js',
  },
  plugins: [
    new CleanPlugin(['lib'], {root: helpers.root('')}),
  ],
});

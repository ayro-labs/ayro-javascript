const helpers = require('./commons/helpers');
const webpackDev = require('./commons/webpack.common.dev.js');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = webpackMerge(webpackDev, {
  output: {
    path: helpers.root('dist'),
    filename: 'ayro.js',
  },
  plugins: [
    new CleanPlugin(['dist'], {root: helpers.root('')}),
  ],
});

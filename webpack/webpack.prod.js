'use strict'

const helpers = require('./helpers');
const webpackCommon = require('./webpack.common.js');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ReplacePlugin = require('replace-bundle-webpack-plugin');

module.exports = webpackMerge(webpackCommon, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify('https://api.chatz.io'),
        WCM_URL: JSON.stringify('https://api.chatz.io:3102'),
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
    new ReplacePlugin([{
      partten: /url\(\\'\/assets/g,
      replacement: function () {
        return 'url(\\\'https://www.chatz.io/assets';
      },
    }]),
  ],
});

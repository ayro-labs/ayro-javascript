'use strict'

const helpers = require('./helpers');
const webpackCommon = require('./webpack.common.js');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackCommon, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify('https://api.chatz.io'),
        WCM_URL: JSON.stringify('https://api.chatz.io:3102'),
        PRODUCTION: true,
      },
    }),
  ],
});

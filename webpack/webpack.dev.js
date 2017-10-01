'use strict'

const helpers = require('./helpers');
const webpackCommon = require('./webpack.common.js');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackCommon, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify('http://localhost:3000'),
        WCM_URL: JSON.stringify('http://localhost:3102'),
        PRODUCTION: false,
      },
    }),
  ],
});

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
        API_URL: JSON.stringify('http://localhost:3000'),
        WCM_URL: JSON.stringify('http://localhost:3102'),
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new ReplacePlugin([{
      partten: /url\('\/assets/g,
      replacement: function () {
        return 'url(\'http://localhost:4000/assets';
      },
    }]),
  ],
});

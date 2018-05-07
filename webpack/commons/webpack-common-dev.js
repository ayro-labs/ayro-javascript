'use strict';

const settings = require('../../configs/settings')('development');
const webpackCommon = require('./webpack-common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackCommon(settings.env), {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(settings.env),
        API_URL: JSON.stringify(settings.apiUrl),
        WEBCM_URL: JSON.stringify(settings.webcmUrl),
      },
    }),
  ],
});

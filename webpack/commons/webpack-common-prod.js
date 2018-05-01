const settings = require('../../configs/settings')('production');
const webpackCommon = require('./webpack-common');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackCommon, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(settings.env),
        API_URL: JSON.stringify(settings.apiUrl),
        WEBCM_URL: JSON.stringify(settings.webcmUrl),
      },
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
});

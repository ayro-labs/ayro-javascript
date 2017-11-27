const settings = require('../../configs/settings');
const helpers = require('./helpers');
const webpackCommon = require('./webpack.common.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const prodSettings = settings.get('production');

module.exports = webpackMerge(webpackCommon, {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'string-replace-loader',
            query: {
              search: /url\('\/assets/g,
              replace: 'url(\'https://www.ayro.io/assets',
            },
          },
          'css-loader',
          'less-loader',
        ],
        include: helpers.root('src/assets/styles'),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(prodSettings.env),
        API_URL: JSON.stringify(prodSettings.apiUrl),
        WCM_URL: JSON.stringify(prodSettings.webcmUrl),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
  ],
});

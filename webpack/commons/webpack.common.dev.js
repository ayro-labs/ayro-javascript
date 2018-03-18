const settings = require('../../configs/settings')('development');
const helpers = require('./helpers');
const webpackCommon = require('./webpack.common.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(webpackCommon, {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                'website': '"http://localhost:4000"'
              }
            },
          },
        ],
        include: helpers.root('src/assets/styles'),
      },
    ],
  },
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

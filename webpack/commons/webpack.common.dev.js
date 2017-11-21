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
          'style-loader',
          {
            loader: 'string-replace-loader',
            query: {
              search: /url\('\/assets/g,
              replace: 'url(\'http://localhost:4000/assets',
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
        API_URL: JSON.stringify('http://localhost:3000'),
        WCM_URL: JSON.stringify('http://localhost:3102'),
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
});

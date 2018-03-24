const helpers = require('./commons/helpers');
const webpackProd = require('./commons/webpack-common-prod.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = webpackMerge(webpackProd, {
  output: {
    path: helpers.root('/dist/wordpress'),
    filename: 'ayro-wordpress.min.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CHANNEL: '"wordpress"',
      },
    }),
    new CleanPlugin(['dist/wordpress'], {root: helpers.root('')}),
  ],
});

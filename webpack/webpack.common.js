'use strict';

const helpers = require('./helpers');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: helpers.root('src/entry.ts'),
  devtool: 'source-map',
  output: {
    path: helpers.root('lib'),
    filename: 'chatz.js',
    library: 'Chatz',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      helpers.root('src'),
      helpers.root('node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: helpers.root('src'),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: helpers.root('src/assets/styles'),
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        include: helpers.root('src/assets/styles'),
      },
    ],
  },
  plugins: [
    new CleanPlugin(['dist', 'lib'], {root: helpers.root('')}),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};

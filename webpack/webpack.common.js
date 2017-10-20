'use strict';

const helpers = require('./helpers');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: helpers.root('src/entry.ts'),
  devtool: 'source-map',
  output: {
    path: helpers.root('dist'),
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
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: helpers.root('src'),
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: helpers.root('src/assets/css'),
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
        include: helpers.root('src/assets/css'),
      },
    ],
  },
  plugins: [
    new CleanPlugin(['dist'], {root: helpers.root('')}),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};

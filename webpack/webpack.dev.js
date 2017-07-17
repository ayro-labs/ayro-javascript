'use strict';

const helpers = require('./helpers');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['whatwg-fetch', './src/umd.js'],
  output: {
    path: helpers.root('dist'),
    filename: 'chatz.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      helpers.root('/src'),
      helpers.root('/node_modules')
    ],
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: helpers.root('/src'),
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: helpers.root('/src/assets/css'),
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
        include: helpers.root('/src/assets/css'),
      },
    ],
  },
  plugins: [
    new CleanPlugin(['dist'], {
      root: helpers.root('/'),
    }),
  ],
};

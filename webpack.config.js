'use strict';

module.exports = {
  entry: ['whatwg-fetch', './src/umd.js'],
  output: {
    path: __dirname + '/dist',
    filename: 'chatz.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: __dirname + '/src'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: __dirname + '/assets/stylesheets'
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
        include: __dirname + '/assets/stylesheets'
      }
    ]
  }
};
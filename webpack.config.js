'use strict';

let path = require('path');

module.exports = {
  entry: ['./src/app.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
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
        exclude: /node_modules/
      }
    ]
  }
};
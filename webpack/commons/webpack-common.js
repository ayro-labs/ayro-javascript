'use strict';

const helpers = require('./helpers');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    devtool: 'source-map',
    entry: helpers.root('/src/entry.ts'),
    output: {
      path: helpers.root('/lib'),
      filename: 'ayro.js',
      library: 'Ayro',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [
        helpers.root('/src'),
        helpers.root('/node_modules'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          include: helpers.root('/src'),
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: env === 'production',
              },
            },
          ],
          include: helpers.root('/src/assets/styles'),
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: env === 'production',
              },
            },
            'less-loader',
          ],
          include: helpers.root('src/assets/styles'),
        },
      ],
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
    ],
  };
};

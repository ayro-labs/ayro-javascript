/* eslint-disable import/no-extraneous-dependencies */

'use strict';

const helpers = require('../utils/helpers');
const webpack = require('webpack');
const JsUglifyPlugin = require('uglifyjs-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const CssOptimizePlugin = require('optimize-css-assets-webpack-plugin');
const CssPurgePlugin = require('purgecss-webpack-plugin');
const glob = require('glob');

module.exports = (settings, frame) => {
  function isProduction() {
    return settings.env === 'production';
  }

  let jsFilename = frame ? 'ayro-frame.js' : 'ayro.js';
  let cssFilename = frame ? 'ayro-frame.css' : 'ayro.css';
  if (isProduction()) {
    jsFilename = frame ? 'ayro-frame.min.js' : 'ayro.min.js';
    cssFilename = frame ? 'ayro-frame.min.css' : 'ayro.min.css';
  }

  const optimization = {};
  if (isProduction()) {
    optimization.minimizer = [
      new JsUglifyPlugin({cache: true, parallel: true, sourceMap: true}),
      new CssOptimizePlugin({
        cssProcessorOptions: {
          map: {inline: false},
          safe: true,
        },
      }),
    ];
  }

  const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CssExtractPlugin({filename: cssFilename}),
    new CssPurgePlugin({paths: glob.sync(`${helpers.root('src')}/**/*`, {nodir: true})}),
  ];
  if (frame) {
    plugins.push(new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(settings.apiUrl),
        WEBCM_URL: JSON.stringify(settings.webcmUrl),
      },
    }));
  } else {
    plugins.push(new webpack.DefinePlugin({
      'process.env': {
        LIB_URL: JSON.stringify(settings.libUrl),
        LIB_CSS_URL: JSON.stringify(settings.libCssUrl),
        FRAME_URL: JSON.stringify(settings.frameUrl),
        FRAME_CSS_URL: JSON.stringify(settings.frameCssUrl),
      },
    }));
  }

  return {
    optimization,
    plugins,
    mode: settings.env,
    devtool: 'source-map',
    entry: helpers.root('src', frame ? 'frame' : 'lib', 'entry.ts'),
    output: {
      path: helpers.root('dist'),
      filename: jsFilename,
      library: 'Ayro',
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
          use: [CssExtractPlugin.loader, 'css-loader'],
          include: helpers.root('src'),
        },
        {
          test: /\.less$/,
          use: [CssExtractPlugin.loader, 'css-loader', 'less-loader'],
          include: helpers.root('src'),
        },
      ],
    },
  };
};

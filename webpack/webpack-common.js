'use strict';

const helpers = require('./helpers');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (settings, frame) => {
  function isDevelopment() {
    return settings.env === 'development';
  }

  let entry;
  let jsFilename;
  let cssFilename;

  if (frame) {
    entry = helpers.root('/src/frame/entry.ts');
  } else {
    entry = helpers.root('/src/lib/entry.ts');
  }
  if (isDevelopment()) {
    jsFilename = frame ? 'ayro-frame.js' : 'ayro.js';
    cssFilename = frame ? 'ayro-frame.css' : 'ayro.css';
  } else {
    jsFilename = frame ? 'ayro-frame.min.js' : 'ayro.min.js';
    cssFilename = frame ? 'ayro-frame.min.css' : 'ayro.min.css';
  }

  const output = {
    path: helpers.root('/dist'),
    filename: jsFilename,
    library: 'Ayro',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  };

  const plugins = [
    new webpack.LoaderOptionsPlugin({debug: true}),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({filename: cssFilename, allChunks: true}),
  ];
  if (frame) {
    plugins.push(new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(settings.env),
        API_URL: JSON.stringify(settings.apiUrl),
        WEBCM_URL: JSON.stringify(settings.webcmUrl),
      },
    }));
  } else {
    plugins.push(new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(settings.env),
        LIB_URL: JSON.stringify(settings.libUrl),
        LIB_CSS_URL: JSON.stringify(settings.libCssUrl),
        FRAME_URL: JSON.stringify(settings.frameUrl),
        FRAME_CSS_URL: JSON.stringify(settings.frameCssUrl),
      },
    }));
  }
  if (!isDevelopment()) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  return {
    entry,
    output,
    plugins,
    devtool: isDevelopment() ? 'source-map' : false,
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
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                minimize: !isDevelopment(),
              },
            }],
          }),
          include: helpers.root('/src'),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                minimize: !isDevelopment(),
              },
            }, 'less-loader'],
          }),
          include: helpers.root('/src'),
        },
      ],
    },
  };
};

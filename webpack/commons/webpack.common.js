const helpers = require('./helpers');
const webpack = require('webpack');

module.exports = {
  entry: helpers.root('src/entry.ts'),
  devtool: 'source-map',
  output: {
    path: helpers.root('dist/lib'),
    filename: 'ayro.js',
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
        use: ['style-loader', 'css-loader'],
        include: helpers.root('src/assets/styles'),
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};

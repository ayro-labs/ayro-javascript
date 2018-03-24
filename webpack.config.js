const {properties} = require('@ayro/commons');
const path = require('path');

properties.setup(path.join(__dirname, 'config.properties'));

const webpackLibDev = require('./webpack/webpack-lib-dev.js');
const webpackLibProd = require('./webpack/webpack-lib-prod.js');
const webpackBrowserDev = require('./webpack/webpack-browser-dev.js');
const webpackBrowserProd = require('./webpack/webpack-browser-prod.js');
const webpackBrowserWordPressDev = require('./webpack/webpack-browser-wordpress-dev.js');
const webpackBrowserWordPressProd = require('./webpack/webpack-browser-wordpress-prod.js');

module.exports = (env) => {
  if (env && env.production) {
    if (!env.browser) {
      return webpackLibProd;
    }
    if (env.wordpress) {
      return webpackBrowserWordPressProd;
    } else {
      return webpackBrowserProd;
    }
  }
  if (env && env.development) {
    if (!env.browser) {
      return webpackLibDev;
    }
    if (env.wordpress) {
      return webpackBrowserWordPressDev;
    } else {
      return webpackBrowserDev;
    }
  }
  throw new Error('Invalid webpack build option');
};

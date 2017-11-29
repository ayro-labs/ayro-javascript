const webpackBrowserProd = require('./webpack/webpack.browser.prod.js');
const webpackBrowserDev = require('./webpack/webpack.browser.dev.js');
const webpackLibProd = require('./webpack/webpack.lib.prod.js');
const webpackLibDev = require('./webpack/webpack.lib.dev.js');

module.exports = (env) => {
  if (env && env.production) {
    return env.browser ? webpackBrowserProd : webpackLibProd;
  }
  if (env && env.development) {
    return env.browser ? webpackBrowserDev : webpackLibDev;
  }
  throw new Error('Invalid webpack build option');
};

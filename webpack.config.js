'use strict';

module.exports = (env) => {
  if (env && env.production) {
    if (env.browser) {
      return require('./webpack/webpack.browser.prod.js');
    } else {
      return require('./webpack/webpack.prod.js');
    }
  }
  if (env && env.development) {
    if (env.browser) {
      return require('./webpack/webpack.browser.dev.js');
    } else {
      return require('./webpack/webpack.dev.js');
    }
  }
};

'use strict';

module.exports = (env) => {
  if (env && env.production) {
    return require('./webpack/webpack.prod.js');
  } else {
    return require('./webpack/webpack.dev.js');
  }
};

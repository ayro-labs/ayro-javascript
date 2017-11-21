module.exports = (env) => {
  if (env && env.production) {
    if (env.browser) {
      return require('./webpack/webpack.browser.prod.js');
    } else {
      return require('./webpack/webpack.lib.prod.js');
    }
  }
  if (env && env.development) {
    if (env.browser) {
      return require('./webpack/webpack.browser.dev.js');
    } else {
      return require('./webpack/webpack.lib.dev.js');
    }
  }
};

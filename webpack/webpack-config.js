'use strict';

const settings = require('../configs/settings');
const webpackCommon = require('./webpack-common.js');
const path = require('path');
const del = require('del');

del.sync([path.resolve('dist')]);

const devSettings = settings('development');
const prodSettings = settings('production');

module.exports = (env) => {
  let configs;
  if (env && env.production) {
    const libConfig = webpackCommon(prodSettings, false);
    const frameConfig = webpackCommon(prodSettings, true);
    configs = [libConfig, frameConfig];
  } else {
    const libConfig = webpackCommon(devSettings, false);
    const frameConfig = webpackCommon(devSettings, true);
    configs = [libConfig, frameConfig];
  }
  return configs;
};

'use strict';

const {properties} = require('@ayro/commons');
const helpers = require('./webpack/helpers');

properties.setup(helpers.root('/config.properties'));

const devSettings = require('./configs/settings')('development');
const prodSettings = require('./configs/settings')('production');
const webpackCommon = require('./webpack/webpack-common.js');
const del = require('del');

del.sync([helpers.root('/dist')]);

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

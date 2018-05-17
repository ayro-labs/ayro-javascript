'use strict';

const {properties} = require('@ayro/commons');
const helpers = require('./webpack/helpers');

properties.setup(helpers.root('/config.properties'));

const devSettings = require('./configs/settings')('development');
const prodSettings = require('./configs/settings')('production');
const webpackCommons = require('./webpack/webpack-commons.js');
const del = require('del');

del.sync([helpers.root('/dist')]);

module.exports = (env) => {
  let configs;
  if (env && env.production) {
    const libConfig = webpackCommons(prodSettings, false);
    const frameConfig = webpackCommons(prodSettings, true);
    configs = [libConfig, frameConfig];
  } else {
    const libConfig = webpackCommons(devSettings, false);
    const frameConfig = webpackCommons(devSettings, true);
    configs = [libConfig, frameConfig];
  }
  return configs;
};

'use strict';

const {properties} = require('@ayro/commons');
const path = require('path');

properties.setup(path.join(__dirname, 'config.properties'));

const webpackWebsiteLibDev = require('./webpack/webpack-website-lib-dev.js');
const webpackWebsiteLibProd = require('./webpack/webpack-website-lib-prod.js');
const webpackWebsiteDev = require('./webpack/webpack-website-dev.js');
const webpackWebsiteProd = require('./webpack/webpack-website-prod.js');
const webpackWordPressDev = require('./webpack/webpack-wordpress-dev.js');
const webpackWordPressProd = require('./webpack/webpack-wordpress-prod.js');

module.exports = (env) => {
  if (env && env.production) {
    return [webpackWebsiteLibProd, webpackWebsiteProd, webpackWordPressProd];
  }
  return [webpackWebsiteLibDev, webpackWebsiteDev, webpackWordPressDev];
};

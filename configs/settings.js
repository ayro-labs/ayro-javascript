'use strict';

const {properties} = require('@ayro/commons');

module.exports = (env) => {
  const settings = {env};
  if (env === 'production') {
    settings.apiUrl = 'https://api.ayro.io';
    settings.webcmUrl = 'https://webcm.ayro.io';
  } else {
    settings.apiUrl = properties.get('api.url', 'http://localhost:3000');
    settings.webcmUrl = properties.get('webcm.url', 'http://localhost:3102');
  }
  return settings;
};

'use strict';

const {properties} = require('@ayro/commons');

module.exports = (env) => {
  const settings = {env};
  if (env === 'production') {
    settings.apiUrl = 'https://api.ayro.io';
    settings.webcmUrl = 'https://webcm.ayro.io';
    settings.libUrl = 'https://cdn.ayro.io/sdks/ayro.min.js';
    settings.libCssUrl = 'https://cdn.ayro.io/sdks/ayro.min.css';
    settings.frameUrl = 'https://cdn.ayro.io/sdks/ayro-frame.min.js';
    settings.frameCssUrl = 'https://cdn.ayro.io/sdks/ayro-frame.min.css';
  } else {
    settings.apiUrl = properties.get('api.url', 'http://localhost:3000');
    settings.webcmUrl = properties.get('webcm.url', 'http://localhost:3102');
    settings.libUrl = 'http://localhost:9000/dist/ayro.js';
    settings.libCssUrl = 'http://localhost:9000/dist/ayro.css';
    settings.frameUrl = 'http://localhost:9000/dist/ayro-frame.js';
    settings.frameCssUrl = 'http://localhost:9000/dist/ayro-frame.css';
  }
  return settings;
};

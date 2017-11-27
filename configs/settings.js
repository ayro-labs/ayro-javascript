const properties = require('./properties');

exports.get = (env) => {
  const settings = {env};
  if (env === 'production') {
    settings.apiUrl = 'https://api.ayro.io';
    settings.webcmUrl = 'https://webcm.ayro.io';
  } else {
    settings.apiUrl = properties.getValue('api.url', 'http://localhost:3000');
    settings.webcmUrl = properties.getValue('webcm.url', 'http://localhost:3102');
  }
  if (!settings.apiUrl) {
    throw new Error('Property api.url is required');
  }
  if (!settings.webcmUrl) {
    throw new Error('Property webcm.url is required');
  }
  return settings;
};

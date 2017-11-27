const properties = require('./properties');

module.exports = (env) => {
  const settings = {env};
  if (env === 'production') {
    settings.apiUrl = 'https://api.ayro.io';
    settings.webcmUrl = 'https://webcm.ayro.io';
  } else {
    settings.apiUrl = properties.getValue('api.url', 'http://localhost:3000');
    settings.webcmUrl = properties.getValue('webcm.url', 'http://localhost:3102');
  }
  return settings;
};

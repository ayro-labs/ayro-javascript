'use strict';

const path = require('path');

const rootPath = path.resolve(__dirname, '../../');

exports.root = (...args) => {
  return path.join(rootPath, ...args);
};

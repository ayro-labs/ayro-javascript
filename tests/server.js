'use strict';

const {logger} = require('@ayro/commons');
const path = require('path');
const express = require('express');

logger.setup({level: 'debug'});

const app = express();

app.set('env', 'development');
app.set('port', 9000);
app.set('view options', {layout: false});
app.use('/dist', express.static(path.resolve('dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('tests', 'index.html'));
});

app.get('/prod', (req, res) => {
  res.sendFile(path.resolve('tests', 'index-prod.html'));
});

app.listen(app.get('port'), () => {
  logger.info('Test server is listening on port %s', app.get('port'));
});

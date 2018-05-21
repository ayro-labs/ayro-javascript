'use strict';

const helpers = require('../utils/helpers');
const express = require('express');

const app = express();

app.set('env', 'development');
app.set('port', 9000);
app.set('view options', {layout: false});
app.use('/dist', express.static(helpers.root('dist')));

app.get('/', (req, res) => {
  res.sendFile(helpers.root('tests', 'index.html'));
});

app.get('/prod', (req, res) => {
  res.sendFile(helpers.root('tests', 'index-prod.html'));
});

app.listen(app.get('port'));

'use strict';

const express = require('express');
const path = require('path');
const app = express();

app.set('view options', {layout: false});
app.use('/', express.static(__dirname));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(5000);

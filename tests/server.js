'use strict';

const express = require('express');
const app = express();

app.set('view options', {layout: false});
app.use(express.static(__dirname));
app.use(express.static('../client-dist'))

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(4000);

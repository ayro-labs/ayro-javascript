const express = require('express');
const path = require('path');
const app = express();

app.set('env', 'development');
app.set('port', 5000);
app.set('view options', {layout: false});
app.use('/', express.static(__dirname));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/prod', (req, res) => {
  res.render('index-prod.html');
});

app.listen(app.get('port'));

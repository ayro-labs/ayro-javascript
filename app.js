'use strict';

let express = require('express');
let app = express();

app.set("view options", {layout: false});
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(4000);

var express = require('express');
var app = express();

var router = require('../router.js')({
  express: app,
  routes: __dirname+'/routes.json',
  controllers: __dirname+'/ctrls'
});

app.listen(6060);
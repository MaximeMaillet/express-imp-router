var express = require('express');
var app = express();

var router = require('./src/router');
router.route(app, __dirname+'/routes.json', {
  controllers: __dirname+'/ctrls'
});


app.listen(9090);
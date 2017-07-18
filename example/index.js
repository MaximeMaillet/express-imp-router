var express = require('express');
var app = express();

var router = require('express-router');
router.route(app, __dirname+'/routes.json', {
  controllers: __dirname+'/ctrls'
});


app.listen(6060);
var express = require('express');
var app = express();

var router = require('../router');
router.route(app, __dirname+'/routes.json', {
  controllers: __dirname+'/ctrls'
});

// @todo page static



app.listen(6060);
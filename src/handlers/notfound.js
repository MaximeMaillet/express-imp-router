const path = require('path');
const express = require('express');
const expressApp = express();

module.exports.handle = (req, res, next) => {
  expressApp.set('view engine', 'ejs');
  res.status(404).send();//.render(`${path.resolve('.')}/src/assets/errors.ejs`, {
    // status: 404,
    // message: 'Not found'
  // });
};
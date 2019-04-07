const express = require('express');
const expressApp = express();
const path = require('path');

module.exports = {
  handle,
};

function handle(err, req, res, next, isDebug) {
  req.error = err;

  if(isDebug) {
    console.error(err.message);
  }

  expressApp.set('view engine', 'ejs');
  res.status(500).render(`${path.resolve('.')}/src/assets/errors.ejs`, {
    status: 500,
    message: err.message
  });


  // const errorHandlers = Route.routes('handler').filter((obj) => {
  //   return obj.target === req.url;
  // });
  //
  // if(errorHandlers.length > 0) {
  //   return redirect(errorHandlers[0], req, res, next);
  // }


  // const errorRoute = Route.routes('err').filter((obj) => {
  //   return obj.extra.status === 500;
  // });
  //
  //
  // if(errorRoute.length > 0) {
  //   return redirect(errorRoute[0], req, res, next, err);
  // } else {
  //   app.set('view engine', 'ejs');
  //   res.status(500).render(`${__dirname}/assets/errors.ejs`, {
  //     status: 500,
  //     message: err.message
  //   });
  // }
}
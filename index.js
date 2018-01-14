'use strict';
const debug = require('debug')('ExpressImpRouter.index');
const express = require('express');
const Route = require('./src/route');
let app = null, isDebug = false;

/**
 * @param _app
 */
module.exports = function(_app) {
  app = _app;

  process.argv.forEach((val) => {
    if(val.startsWith('-v')) {
      isDebug = true;
    }
  });
};

/**
 * Initialize routes
 * @param routesConfig
 */
module.exports.route = (routesConfig) => {
  try {
    readRoutesConfiguration(routesConfig);

    app.use(catchClientError);

    const staticRoute = Route.routes('static');
    for(const i in staticRoute) {
      app.use(staticRoute[i].route, express.static(staticRoute[i].controller, staticRoute[i].config));
    }

    const routes = Route.routes('all');
    for(const i in routes) {
      app[routes[i].method](routes[i].route, routes[i].function);
    }

    app.use(errorHandler);

    if(isDebug) {
      const columnify = require('columnify');
      const columns = columnify(Route.debug());
      console.log(columns);
    }
  } catch(e) {
    debug(e.message);
  }
};

/**
 * @param routesConfig
 */
function readRoutesConfiguration(routesConfig) {
  for(const i in routesConfig) {
    const config = configuration(routesConfig[i]);
    Route.extractRoutesAndGenerate(config);
  }
}

/**
 * @param config
 * @return {*}
 */
function configuration(config) {
  debug('Read configuration');

  if(!config) {
    throw new Error('Config are not defined, please referrer to documentation');
  }

  if(!config.routes) {
    throw new Error('Routes JSON file is not defined, please referrer to documentation');
  }

  if(!config.controllers) {
    throw new Error('Controllers directory is not defined');
  }

  if(!config.controllers.endsWith('/')) {
    config.controllers += '/';
  }

  return config;
}

/**
 * Catch client response for redirect to error
 * @param req
 * @param res
 * @param next
 */
function catchClientError(req, res, next) {
  const { end } = res;

  res.end = function() {
    const errorRoute = Route
      .routes('err')
      .filter((obj) => {
        return obj.extra.status === res.statusCode && obj.route !== req.url;
      });

    if(errorRoute.length > 0) {
      return res.redirect(errorRoute[0].route);
    }

    end.apply(res, arguments);
  };

  next();
}

/**
 * Error handler
 * @param err
 * @param req
 * @param res
 * @param next
 */
function errorHandler(err, req, res, next) {
  const errorRoute = Route.routes('err').filter((obj) => {
    return obj.extra.status === 500;
  });

  if(errorRoute.length > 0) {
    res.redirect(`${errorRoute[0].route}`);
  } else {
    res.status(500).send(err);
  }

  next();
}
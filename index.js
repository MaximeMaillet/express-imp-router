'use strict';
const debug = require('debug')('ExpressImpRouter.index');
const express = require('express');
const Route = require('./src/route');
let app = null, isDebug = false, isRedirect = false;

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

  return module.exports;
};

/**
 * Initialize routes
 * @param routesConfig
 */
module.exports.route = (routesConfig) => {
  try {
    readRoutesConfiguration(routesConfig);

    app.use(catchClientError);

    const globalMiddleware = Route.middleware('init');
    for(const i in globalMiddleware) {
      app.use(globalMiddleware[i].action);
    }

    const viewsEngine = Route.viewsEngine();
    for(const i in viewsEngine) {
      app.set('views', viewsEngine[i].views);
      app.set('view engine', viewsEngine[i].engine);
      app.engine('jsx', viewsEngine[i].action);
    }

    const staticRoute = Route.routes('static');
    for(const i in staticRoute) {
      const middleware = Route.middleware(staticRoute[i].route);
      for(const j in middleware) {
        app.use(middleware[j].target, middleware[j].action);
      }
      app.use(staticRoute[i].route, express.static(`${staticRoute[i].controller}`, staticRoute[i].options));
    }

    const routes = Route.routes();
    for(const i in routes) {
      const middleware = Route.middleware(routes[i].route);
      for(const j in middleware) {
        if(middleware[j].target === '*') {
          app.use(routes[i].route, middleware[j].action);
        } else {
          app.use(middleware[j].target, middleware[j].action);
        }
      }
      app[routes[i].method](routes[i].route, routes[i].action);
    }

    app.use(errorHandler);

    app.use(notFoundHandler);

    if(isDebug) {
      const columnify = require('columnify');
      const columns = columnify(Route.debug());
      console.log(columns);
    }

    return Route.routes('user');
  } catch(e) {
    console.log(e);
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

  if(config.errorHandler && !config.errorHandler.endsWith('/')) {
    config.errorHandler += '/';
  }

  if(config.middlewares && !config.middlewares.endsWith('/')) {
    config.middlewares += '/';
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
    // console.log(`Catch client response : ${req.url} ${res.statusCode}`);
    const errorRoute = Route
      .routes('err')
      .filter((obj) => {
        return obj.extra.status === res.statusCode && obj.route !== req.url;
      });

    if(errorRoute.length > 0 && !isRedirect) {
      return redirect(errorRoute[0], req, res, next);
    }

    isRedirect = false;
    end.apply(res, arguments);
  };

  next();
}

/**
 * @param req
 * @param res
 */
function notFoundHandler(req, res) {
  app.set('view engine', 'ejs');
  res.status(404).render(`${__dirname}/src/assets/errors.ejs`, {
    status: 404,
    message: 'Not found'
  });
}

/**
 * Error handler
 * @param err
 * @param req
 * @param res
 * @param next
 */
function errorHandler(err, req, res, next) {
  req.error = err;
  const errorHandlers = Route.routes('handler').filter((obj) => {
    return obj.target === req.url;
  });

  if(errorHandlers.length > 0) {
    return redirect(errorHandlers[0], req, res, next);
  }


  const errorRoute = Route.routes('err').filter((obj) => {
    return obj.extra.status === 500;
  });

  if(isDebug) {
    console.log(err.message);
  }

  if(errorRoute.length > 0) {
    return redirect(errorRoute[0], req, res, next, err);
  } else {
    app.set('view engine', 'ejs');
    res.status(500).render(`${__dirname}/src/assets/errors.ejs`, {
      status: 500,
      message: err.message
    });
  }
}

function redirect(routeConfig, req, res, next) {
  console.log(`Redirect to ${routeConfig.route}`);
  isRedirect = true;
  return routeConfig.action(req, res, next);
}
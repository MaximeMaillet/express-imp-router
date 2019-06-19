const express = require('express');
const generator = require('./generator/generator');
const Config = require('./lib/configuration');
const Route = require('./lib/routes');
const Middleware = require('./lib/middlewares');
const NotFoundHandler = require('./handlers/notfound');
const ErrorHandler = require('./handlers/error');
const MIDDLEWARE_LEVEL = require('./config/middleware').LEVEL;

let isDebug = false, expressApp = null;

/**
 * @param app
 */
module.exports = function(app) {
  expressApp = app;

  checkApp();

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

  checkApp();

  routesConfig = Config.read(routesConfig);

  try {
    generator.generate(Route.extract(routesConfig));
    generator.generate(Middleware.extract(routesConfig));

    let notFoundErrors = 0;
    const routes = Route.get();
    for(const i in routes) {
      const globalMiddleware = Middleware.get(MIDDLEWARE_LEVEL.GLOBAL, routes[i].route);
      if(globalMiddleware.length > 0) {
        expressApp.use(routes[i].route, globalMiddleware.map(middleware => middleware.actions));
      }

      // Add static routes
      if(routes[i].static) {
        for(const j in routes[i].actions) {
          expressApp.use(routes[i].route, express.static(routes[i].actions[j]));
        }
        continue;
      }

      // Add app middlewares
      const appMiddleware = Middleware.get(MIDDLEWARE_LEVEL.APP, routes[i].route, routes[i].method);
      if(appMiddleware.length > 0) {
        expressApp[routes[i].method](routes[i].route, appMiddleware.map(middleware => middleware.actions), routes[i].actions);
      } else {
        expressApp[routes[i].method](routes[i].route, routes[i].actions);
      }
    }

    // Add error middlewares
    const errorMiddleware = Middleware.get(MIDDLEWARE_LEVEL.ERROR);
    for(const i in errorMiddleware) {
      expressApp.use(errorMiddleware[i].route, errorMiddleware[i].actions);
    }

    expressApp.use(ErrorHandler.handle);

    expressApp.use((req, res, next) => {
      notFoundErrors = Middleware.get(MIDDLEWARE_LEVEL.NOT_FOUND);
      for(const i in notFoundErrors) {
        const regExp = new RegExp(notFoundErrors[i].route);
        if(regExp.exec(req.url)) {
          return notFoundErrors[i].actions[0](req, res, next);
        }
      }

      next();
    });

    expressApp.use(NotFoundHandler.handle);

    if(isDebug) {
      const columnify = require('columnify');
      const configRoute = Route.get(true);
      for(const i in configRoute) {
        const columns = columnify(configRoute[i]);
        console.log(columns);
      }
    }
  } catch(e) {
    console.log(e);
  }
};

/**
 * Enable debug mode
 */
module.exports.enableDebug = () => {
  isDebug = true;
  Route.enableDebug();
  Middleware.enableDebug();
};

/**
 * Check if app exists  and it's correct
 */
function checkApp() {
  if (!expressApp) {
    throw new Error('You should provide app from express');
  }
}
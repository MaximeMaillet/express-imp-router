const express = require('express');
const generator = require('./generator/generator');
const Config = require('./lib/configuration');
const Route = require('./lib/routes');
const Middleware = require('./lib/middlewares');
const NotFoundHandler = require('./handlers/notfound');
const ErrorHandler = require('./handlers/error');
const MIDDLEWARE_LEVEL = require('./config/middleware').LEVEL;
const MIDDLEWARE_INHERITANCE = require('./config/middleware').INHERITANCE;

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

module.exports.purge = () => {
  Route.purge();
  Middleware.purge();
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

    const globalMiddleware = Middleware.get(MIDDLEWARE_LEVEL.GLOBAL);
    if(globalMiddleware.length > 0) {
      expressApp.use(globalMiddleware.map(middleware => middleware.actions));
    }

    let notFoundErrors = 0;
    const globalMiddleware = Middleware.get(MIDDLEWARE_LEVEL.GLOBAL);
    if(globalMiddleware.length > 0) {
      expressApp.use(globalMiddleware.map(middleware => middleware.actions));
    }

    const routes = Route.get();
    for(const i in routes) {
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
    expressApp.use([
      (err, req, res, next) => {
        const errorMiddleware = Middleware.get(MIDDLEWARE_LEVEL.ERROR);
        for(const i in errorMiddleware) {
          let regExp = null;
          if(errorMiddleware[i].inheritance === MIDDLEWARE_INHERITANCE.DESC) {
            regExp = new RegExp(`^${errorMiddleware[i].route}`);
          } else {
            regExp = new RegExp(`^${errorMiddleware[i].route}$`);
          }

          if(regExp.exec(req.url)) {
            return errorMiddleware[i].actions[0](err, req, res, next);
          }
        }

        next(err);
      },
      ErrorHandler.handle
    ]);

    // Not found middlewares
    expressApp.use([
      (req, res, next) => {
        notFoundErrors = Middleware.get(MIDDLEWARE_LEVEL.NOT_FOUND);
        for(const i in notFoundErrors) {
          let regExp = null;
          if(notFoundErrors[i].inheritance === MIDDLEWARE_INHERITANCE.DESC) {
            regExp = new RegExp(`^${notFoundErrors[i].route}`);
          } else {
            regExp = new RegExp(`^${notFoundErrors[i].route}$`);
          }

          if(regExp.exec(req.url)) {
            return notFoundErrors[i].actions[0](req, res, next);
          }
        }
        next();
      },
      NotFoundHandler.handle
    ]);

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
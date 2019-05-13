const debug = require('debug')('ExpressImpRouter.index');
const express = require('express');
const generator = require('./lib/generator');
const Config = require('./lib/configuration');
const Route = require('./lib/routes');
const Middleware = require('./lib/middlewares');
const NotFoundHandler = require('./handlers/notfound');
const ErrorHandler = require('./handlers/error');
const MIDDLEWARE_LEVEL = require('./config/middleware');

let isDebug = false, expressApp = null;

/**
 * @param app
 */
module.exports = function(app) {
  expressApp = app;

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
    routesConfig = Config.read(routesConfig);
    for(const i in routesConfig) {
      if (typeof routesConfig[i].routes !== 'object') {
        routesConfig[i].routes = require(routesConfig[i].routes);
      }
    }

    generator.generate(Route.extract(routesConfig));
    generator.generate(Middleware.extract(routesConfig));

    let notFoundErrors = 0;

    // const viewsEngine = Route.viewsEngine();
    // for(const i in viewsEngine) {
    //   app.set('views', viewsEngine[i].views);
    //   app.set('view engine', viewsEngine[i].engine);
    //   app.engine('jsx', viewsEngine[i].action);
    // }

    const routes = Route.get();
    for(const i in routes) {
      const globalMiddleware = Middleware.get(MIDDLEWARE_LEVEL.GLOBAL, routes[i].route);
      if(globalMiddleware.length > 0) {
        expressApp.use(routes[i].route, globalMiddleware.map(middleware => middleware.action));
      }

      // Add static routes
      if(routes[i].static) {
        expressApp.use(routes[i].route, express.static(routes[i].action));
        continue;
      }

      // Add app middlewares
      const appMiddleware = Middleware.get(MIDDLEWARE_LEVEL.APP, routes[i].route, routes[i].method);
      if(appMiddleware.length > 0) {
        expressApp[routes[i].method](routes[i].route, appMiddleware.map(middleware => middleware.action), routes[i].action);
      } else {
        expressApp[routes[i].method](routes[i].route, routes[i].action);
      }
    }

    // Add error middlewares
    const errorMiddleware = Middleware.get(MIDDLEWARE_LEVEL.ERROR);
    console.log(errorMiddleware)
    for(const i in errorMiddleware) {
      expressApp.use(errorMiddleware[i].route, errorMiddleware[i].action);
    }

    expressApp.use(ErrorHandler.handle);

    expressApp.use((req, res, next) => {
      notFoundErrors = Middleware.get(MIDDLEWARE_LEVEL.NOT_FOUND);
      for(const i in notFoundErrors) {
        const regExp = new RegExp(notFoundErrors[i].route);
        if(regExp.exec(req.url)) {
          return notFoundErrors[i].action(req, res, next);
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
    debug(e.message);
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

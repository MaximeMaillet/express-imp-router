const debug = require('debug')('ExpressImpRouter.index');
const express = require('express');

const Config = require('./lib/configuration');
const Route = require('./lib/routes');
const Middleware = require('./lib/middlewares');
const generator = require('./lib/generator');

const NotFoundHandler = require('./handlers/notfound');
const ErrorHandler = require('./handlers/error');

const MIDDLEWARE_LEVEL = require('./config/middleware');

let app = null, isDebug = false, isRedirect = false;

let expressApp = null;

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
    generator.generate(Route.extract(routesConfig));
    generator.generate(Middleware.extract(routesConfig));

    // app.use(catchClientError);

    // const globalMiddleware = Route.middleware('init');
    // for(const i in globalMiddleware) {
    //   app.use(globalMiddleware[i].action);
    // }

    // const viewsEngine = Route.viewsEngine();
    // for(const i in viewsEngine) {
    //   app.set('views', viewsEngine[i].views);
    //   app.set('view engine', viewsEngine[i].engine);
    //   app.engine('jsx', viewsEngine[i].action);
    // }

    // const staticRoute = Route.routes('static');
    // for(const i in staticRoute) {
    //   const middleware = Route.middleware(staticRoute[i].route);
    //   for(const j in middleware) {
    //     app.use(middleware[j].target, middleware[j].action);
    //   }
    //   app.use(staticRoute[i].route, express.static(`${staticRoute[i].controller}`, staticRoute[i].options));
    // }

    //
    // for(const i in middlewares) {
    //   expressApp.use(middlewares[i].route, middlewares[i].action);
    // }

    const routes = Route.get();
    for(const i in routes) {
      // Add static routes
      if(routes[i].static) {
        expressApp.use(routes[i].route, express.static(routes[i].action));
        continue;
      }

      // Add app middlewares
      const appMiddleware = Middleware.get(MIDDLEWARE_LEVEL.APP, routes[i].route, routes[i].method);
      let appScoppedMiddleware = appMiddleware.map((mid => mid.middlewares));
      if(appScoppedMiddleware.length > 0) {
        // Add routes with middlewares
        expressApp[routes[i].method](routes[i].route, appScoppedMiddleware, routes[i].action);
      } else {
        // Add routes
        expressApp[routes[i].method](routes[i].route, routes[i].action);
      }

      // const services = Route.service(routes[i].route);
      // for(const s in services) {
      //   const service = {[services[s].name]: services[s].service};
      //   app.use(routes[i].route, async(req, res, next) => {
      //     req.services = service;
      //     next();
      //   });
      // }

      // const middlewaresInjected = Route.middleware(routes[i].route, 'inject');
      // if(middlewaresInjected.length > 1) {
      //   throw new Error(`Middlewares of 'inject' type can't be more than two`)
      // }
      // if(middlewaresInjected.length > 0) {
      //   app[routes[i].method](routes[i].route, middlewaresInjected[0].action, routes[i].action);
      // } else {
      //   app[routes[i].method](routes[i].route, routes[i].action);
      // }
    }

    // Add error middlewares
    const errorMiddleware = Middleware.get(MIDDLEWARE_LEVEL.ERROR);
    for(let i in errorMiddleware) {
      expressApp.use(errorMiddleware[i].route, errorMiddleware[i].action)
    }

    expressApp.use((err, req, res, next) => ErrorHandler.handle(err, req, res, next, isDebug));

    expressApp.use((req, res, next) => NotFoundHandler.handle(req, res, next, isDebug));

    if(isDebug) {
      const columnify = require('columnify');
      const configRoute = Route.get(true);
      for(let i in configRoute) {
        const columns = columnify(configRoute[i]);
        console.log(columns);
      }
    }

    // return Route.routes('user');
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

/**
 * @param routesConfig
 */
function readRoutesConfiguration(routesConfig) {
  if(!Array.isArray(routesConfig)) {
    throw new Error('Config must be an array');
  }

  for(const i in routesConfig) {
    const config = configuration(routesConfig[i]);
    Route.extractRoutesAndGenerate(config);
  }
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
    res.status(500).render(`${__dirname}/assets/errors.ejs`, {
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
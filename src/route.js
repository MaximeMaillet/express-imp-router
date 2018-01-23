'use strict';
const debug = require('debug')('ExpressImpRouter.route');
const configuration = require('./configuration');
const colors = require('colors');
const emoji = require('node-emoji');
const httpWell = require('know-your-http-well'), phraseWell = httpWell.statusCodesToPhrases;

const Routes = [];
const ErrorRoutes = [];
const StaticRoutes = [];
const MiddleWares = [];
const GlobalMiddleWares = [];

/**
 * Return routes list
 * @return {Array}
 */
module.exports.routes = (_type) => {
  const type = _type || 'user';
  if(type === 'all') {
    return Routes.concat(ErrorRoutes).concat(StaticRoutes);
  }
  else if(type === 'err') {
    return ErrorRoutes.filter((obj) => {
      return obj.generated;
    });
  }
  else if(type === 'user') {
    return Routes.concat(ErrorRoutes).filter((obj) => {
      return obj.generated;
    });
  } else if(type === 'static') {
    return StaticRoutes.filter((obj) => {
      return obj.generated;
    });
  }
};

module.exports.middleware = (route) => {
  if(route === 'all') {
    return GlobalMiddleWares;
  }

  return MiddleWares.filter((obj) => {
    const reg = new RegExp(`^${obj.target}*`);
    return reg.test(route);
  });
};

/**
 * Return route list as debug format
 * @return {Array}
 */
module.exports.debug = () => {
  const route = Routes.concat(ErrorRoutes).concat(StaticRoutes);
  return route.map((obj) => {
    let status = null, {message} = obj;
    if(obj.generated) {
      status = `${emoji.get(':white_check_mark:')}  Route generated : `.green;
      message = 'N/A';
    } else {
      status = `${emoji.get(':x:')}  Route not generated : `.red;
    }

    return {
      status,
      method: obj.method.toUpperCase(),
      route: obj.route,
      controller: obj.controller,
      action: obj.action,
      message
    };
  });
};

/**
 * @param config
 */
module.exports.extractRoutesAndGenerate = (config) => {
  extractRoutes(config.routes);
  generateController(config.controllers);
};

/**
 * Clear all routes
 */
module.exports.clear = () => {
  Routes.splice(0, Routes.length);
  ErrorRoutes.splice(0, ErrorRoutes.length);
  StaticRoutes.splice(0, StaticRoutes.length);
};

/**
 * @param _routes
 */
function extractRoutes(_routes) {
  debug('Extract routes');
  try {
    let routes = null;
    if(typeof _routes === 'object') {
      routes = _routes;
    } else {
      routes = require(_routes);
    }

    Object.keys(routes).map((route) => {
      try {
        if(typeof route !== 'string') {
          throw new Error(`Route must be string not ${route} (${(typeof route)})`);
        }

        if(route.startsWith('/')) {
          parseRoute(route, routes[route]);
        }
        else if(route.startsWith('_')) {
          parseExtraRoutes(route, routes[route]);
        }
      } catch(e) {
        debug(e.message);
      }
    });
  } catch(e) {
    console.log(e);
    debug(e.message);
  }
}

/**
 * @param parentRoute
 * @param config
 */
function parseRoute(parentRoute, config) {
  const obj = Object.keys(config);

  obj.map((key) => {
    if(key.startsWith('/')) {
      parseRoute(parentRoute+key, config[key]);
    }
    else if(configuration.METHODS.indexOf(key.toUpperCase()) !== -1) {
      Routes.push(generateRoute(key, parentRoute, config[key]));
    }
    else {
      throw new Error(`Syntax malformed : (${key})`);
    }
  });
}

/**
 * @param parentRoute
 * @param config
 */
function parseExtraRoutes(parentRoute, config) {
  if(parentRoute === '_errors') {
    parseErrorRoutes(`/${parentRoute}`, config);
  } else if(parentRoute === '_static') {
    parseStaticRoutes(parentRoute, config);
  } else if(parentRoute === '_middleware') {
    parseMiddleware(parentRoute, config);
  }
}

/**
 * @param parentRoute
 * @param config
 */
function parseErrorRoutes(parentRoute, config) {
  const obj = Object.keys(config);
  obj.map((key) => {
    if(key.indexOf('*') !== -1) {
      const status = getAllHttpStatusFrom(key.charAt(0));
      for(const i in status) {
        config = Object.assign(config, {error: status[i].message});
        ErrorRoutes.push(generateRoute('get', `${parentRoute}/${status[i].status}`, config[key], {status: parseInt(status[i].status)}));
      }
    }
    else {
      const status = getAllHttpStatusFrom(key);
      config = Object.assign(config, {error: status.message});
      ErrorRoutes.push(generateRoute('get', `${parentRoute}/${status.status}`, config[key], {status: parseInt(status.status)}));
    }
  });
}

/**
 * Generate static routes
 * @param parentRoute
 * @param config
 */
function parseStaticRoutes(parentRoute, config) {
  Object.keys(config).map((key) => {
    StaticRoutes.push({
      method: 'get',
      route: key,
      controller: config[key].target,
      action: '*',
      options: config[key].options,
      generated: true,
    });
  });
}

/**
 * Parse middlewares
 * @param parentRoute
 * @param config
 */
function parseMiddleware(parentRoute, config) {
  for(const i in config) {
    if(Array.isArray(config[i].action)) {
      for(const k in config[i].action) {
        const controllerConfig = config[i].action[k].split('#');

        if(Array.isArray(config[i].target)) {
          for(const j in config[i].target) {
            MiddleWares.push({
              target: config[i].target[j],
              controller: controllerConfig[0],
              action: controllerConfig[1],
            });
          }
        }
        else {
          GlobalMiddleWares.push({
            target: config[i].target,
            controller: controllerConfig[0],
            action: controllerConfig[1],
          });
        }
      }
    }
  }
}

/**
 * @param method
 * @param route
 * @param config
 * @param extra
 */
function generateRoute(method, route, config, extra) {
  if(typeof config === 'object' && config.controller && config.action) {
    return {
      method,
      route,
      controller: config.controller,
      action: config.action,
      generated: false,
      extra,
    };
  }
  else if(typeof config === 'string' && config.indexOf('#') !== -1) {
    const controllerConfig = config.split('#');
    return {
      method,
      route,
      controller: controllerConfig[0],
      action: controllerConfig[1],
      generated: false,
      extra,
    };
  }
  else {
    throw new Error(`Controllers route is malformed : ${config}`);
  }
}

/**
 * @param controllers
 */
function generateController(controllers) {
  const arrayToScan = [Routes, ErrorRoutes, MiddleWares, GlobalMiddleWares];
  for(const i in arrayToScan) {
    for(const k in arrayToScan) {
      try {
        assignControllerToRoute(controllers, arrayToScan[i][k]);
      } catch(e) {
        debug(e.message);
      }
    }
  }
}

/**
 * @param controllers
 * @param route
 * @return {*}
 */
function assignControllerToRoute(controllers, route) {
  const ctrl = require(controllers+route.controller);
  let fnctn = null;
  if(typeof ctrl === 'object') {
    fnctn = ctrl[route.action];
  }
  else {
    route.message = `Controller not found : ${route.controller}`;
    return route;
  }

  if(typeof fnctn !== 'function') {
    route.message = `${route.controller}#${route.action} is not a function`;
    return route;
  }

  route.object = ctrl;
  route.function = fnctn;
  route.generated = true;
  return route;
}

/**
 * @param statusCode
 * @return {*}
 */
function getAllHttpStatusFrom(statusCode) {
  if(statusCode.length === 3) {
    return {
      status: statusCode,
      message: phraseWell[statusCode],
    };
  }
  else if(statusCode.length === 1) {
    return Object
      .keys(phraseWell)
      .filter((obj) => {
        return obj.startsWith(statusCode);
      })
      .map((value) => {
        return {
          status: value,
          message: phraseWell[value],
        };
      });
  }
}

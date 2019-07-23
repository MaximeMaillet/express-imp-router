const debug = require('debug')('ExpressImpRouter.routes.extract');
const {isMethod, isObject, isFunction, isStatic, isString, isEndpoint} = require('../lib/route-utils');
const errors = require('../config/errors');
const impKeywords = require('../config/imp-keywords');

module.exports = {
  route
};

function fromString(route, method, config) {
  const [controller, action] = config.split('#');
  return {
    route,
    method,
    controller,
    action,
    debug: {
      controller: controller,
      action: action,
    }
  };
}

function fromObject(route, method, config) {
  if(!config.controller && !config.action) {
    throw new Error(`Controller is missing for route : ${route}`);
  }

  const {controller, action, ...rest} = config;

  let fController = null, fAction = null, dController = null, dAction = null;

  if(typeof controller === 'function') {
    fController = null;
    fAction = controller;
    dController = 'Anonymous';
  }
  else if(typeof controller === 'string') {
    if(controller.indexOf('#') !== -1) {
      [fController, fAction] = config.controller.split('#');
      dController = fController;
      dAction = fAction;
    } else {
      fController = dController = controller;
      fAction = dAction = action;
    }
  }
  else if(typeof action === 'function') {
    fController = null;
    fAction = action;
    dController = 'Anonymous';
  }
  else {
    throw new Error(`Controller malformed. String or function expected, ${typeof controller} given.`);
  }

  return {
    ...rest,
    route,
    method,
    controller: fController,
    action: fAction,
    debug: {
      controller: dController,
      action: dAction,
    }
  };
}

function fromFunction(route, method, _function) {
  return {
    route,
    method,
    controller: '_ANON_',
    action: _function,
    debug: {
      controller: 'Anonymous',
    }
  };
}

function forStatic(route, config) {
  const statics = [];
  for(const i in config.targets) {
    statics.push({
      route,
      method: 'get',
      controller: '_ANON_',
      action: config.targets[i],
      static: true,
      debug: {
        controller: '_ANON_',
        action: config.target,
      }
    });
  }
  return statics;
}

function shouldIgnore(key) {
  return [impKeywords.MIDDLEWARE].indexOf(key) !== -1;
}

function extractRoute(name, key, config) {
  let routes = [];
  if(isMethod(key)) {

    if(Array.isArray(config)) {
      for(const i in config) {
        routes = routes.concat(extractRoute(name, key, config[i]));
      }
      return routes;
    }

    if(isString(config)) {
      routes.push(fromString(name, key, config));
    } else if(isObject(config)) {
      routes.push(fromObject(name, key, config));
    } else if(isFunction(config)) {
      routes.push(fromFunction(name, key, config));
    } else {
      debug(`Syntax malformed. "${name} > ${key}" is ignored. It should be an object, string or function. ${typeof config} founded`);
      routes.push({
        route: name,
        method: 'N/A',
        debug: {
          message: `Syntax malformed. "${name} > ${key}" is ignored. It should be an object, string or function. ${typeof config} founded`
        }
      });
    }
  } else if(isStatic(key)) {
    routes = routes.concat(forStatic(name, config));
  } else if(isEndpoint(key)) {
    routes = routes.concat(extract(name+key, config));
  } else if(!shouldIgnore(key)) {
    debug(`Routes config malformed. "${name} > ${key}" is ignored`);
    routes.push({
      route: name,
      method: 'N/A',
      debug: {
        message: `Routes config malformed. "${name} > ${key}" is ignored`
      }
    });
  }

  return routes;
}

/**
 * @param name
 * @param config
 * @return {Array}
 */
function extract(name, config) {
  let routes = [];
  if(/^\/\//.test(name)) {
    name = name.substring(1);
  }

  if(typeof config !== 'object' || Array.isArray(config)) {
    throw new Error(`Route config malformed, it should be an object. ${Array.isArray(config) ? 'array' : typeof config} given`);
  }

  Object.keys(config).map((key) => {
    routes = routes.concat(extractRoute(name, key, config[key]));
  });

  return routes;
}

function dedupe(routes) {
  const uniqueRoutes = [];
  let index = -1;
  for(const i in routes) {
    if((index = uniqueRoutes.map(item => item.method+item.route).indexOf(routes[i].method+routes[i].route)) !== -1) {
      uniqueRoutes[index].controllers.push({
        debug: {},
        ...routes[i],
      });
      uniqueRoutes[index].debug.multiple = true;
    } else {
      uniqueRoutes.push({
        route: routes[i].route,
        method: routes[i].method,
        status: routes[i].status,
        controllers: [{
          debug: {},
          ...routes[i],
        }],
        debug: routes[i].debug,
      });
    }
  }
  return uniqueRoutes;
}

function checkValid(routes) {
  let status = 0;
  for(const i in routes) {
    status = 0;
    if(typeof routes[i].route !== 'string' || !routes[i].route.startsWith('/')) {
      status = status | errors.ROUTE.ROUTE_MALFORMED;
    }

    if(routes[i].method === 'N/A') {
      status = status | errors.ROUTE.METHOD_NOT_EXISTS;
    }

    if(!routes[i].controller || !routes[i].action) {
      status = status | errors.ROUTE.CONTROLLERS_MALFORMED;
    }

    routes[i].status = status;
  }

  return routes;
}

/**
 * @param mainConfig
 * @param routesConfig
 * @param isDebug
 * @return {Array}
 */
function route(mainConfig, routesConfig, isDebug) {
  let routes = [];
  Object.keys(routesConfig).map((route) => {
    if(route.startsWith('/')) {
      routes = routes.concat(extract((mainConfig.root ? mainConfig.root : '') + route, routesConfig[route]));
    } else if(!shouldIgnore(route)) {
      routes.push({
        route,
        method: 'N/A',
        controllers: [{}],
        debug: {
          message: 'Syntaxe malformed, route should starts with "/"'
        }
      });
    }
  });

  for(const i in routes) {
    routes[i].classPath = mainConfig.controllers;
  }

  return dedupe(checkValid(routes));
}

const debug = require('debug')('ExpressImpRouter.routes.extract');
const {isMethod, isObject, isFunction, isStatic, isString, isEndpoint} = require('../lib/route-utils');

function fromString(route, method, config) {
  const [controller, action] = config.split('#');
  return {
    route,
    method,
    controller,
    action,
    generated: false,
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
  let generated = false;

  if(typeof controller === 'function') {
    fController = null;
    fAction = controller;
    dController = 'Anonymous';
    generated = true;
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
    generated = true;
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
    generated,
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
    generated: true,
    debug: {
      controller: 'Anonymous',
    }
  };
}

function forStatic(route, config) {
  const statics = [];
  for(let i in config.targets) {
    statics.push({
      route,
      method: 'GET',
      controller: '_ANON_',
      action: config.targets[i],
      static: true,
      generated: false,
      debug: {
        controller: '_ANON_',
        action: config.target,
      }
    });
  }
  return statics;
}

function shouldIgnore(key) {
  return ['_middleware_'].indexOf(key) !== -1;
}

function extractRoute(name, key, config) {
  let routes = [];
  if(isMethod(key)) {

    if(Array.isArray(config)) {
      for(let i in config) {
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
      debug(`Syntax malformed. "${name} > ${key}" is ignored. It should be an object, string or function. ${typeof config} founded`)
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
    debug(`Routes config malformed. "${name} > ${key}" is ignored`)
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

  if(typeof name !== 'string') {
    throw new Error(`Route should be a string. ${typeof name} founded`);
  }

  if(typeof config !== 'object') {
    throw new Error(`Route config malformed, it should be an object. ${typeof config} given`);
  }

  Object.keys(config).map((key) => {
    routes = routes.concat(extractRoute(name, key, config[key]));
  });

  return routes;
}

function checkRoutes(routes) {
  for(let i in routes) {
    if(
      !routes[i].controller
      || !routes[i].method
      || !routes[i].action
    ) {
      debug(`This routes has error(s) : ${routes[i].route}`)
    }
  }
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
      routes = routes.concat(extract(route, routesConfig[route]));
    } else {
      routes.push({
        route,
        method: 'N/A',
        debug: {
          message: 'Syntaxe malformed, route should starts with "/"'
        }
      })
    }
  });

  for(let i in routes) {
    routes[i].classPath = mainConfig.controllers;
    routes[i].find = true;
  }

  if(isDebug) {
    checkRoutes(routes);
  }

  return routes;
}

module.exports = {
  route
};
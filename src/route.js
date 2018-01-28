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
const ViewEngine = [];
const ErrorsHandler = [];

const path = {
  errorHandler: null,
  middlewares: null,
  controllers: null,
};

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
  } else if(type === 'handler') {
    return ErrorsHandler.filter((obj) => {
      return obj.generated;
    });
  }
};

module.exports.middleware = (route) => {
  if(route === 'init') {
    return GlobalMiddleWares;
  }

  return MiddleWares.filter((obj) => {
    return obj.target === route || obj.target === '*';
  });
};

module.exports.viewsEngine = () => {
  return ViewEngine;
};

/**
 * Return route list as debug format
 * @return {Array}
 */
module.exports.debug = () => {
  const route = Routes.concat(StaticRoutes);//.concat(ErrorRoutes).concat(StaticRoutes);
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
      controller: obj.debug.controller,
      action: obj.debug.action,
      message
    };
  });
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
 * @param config
 */
module.exports.extractRoutesAndGenerate = (config) => {
  path.errorHandler = config.errorHandler || null;
  path.middlewares = config.middlewares || null;
  path.controllers = config.controllers || null;

  let routes = null;
  if(typeof config.routes === 'object') {
    routes = config.routes;
  } else {
    routes = require(config.routes);
  }

  extract(routes);
  generate();
};

/**
 * @param routes
 */
function extract(routes) {
  debug('Extract routes');
  Object.keys(routes).map((route) => {
    try {
      if(typeof route !== 'string') {
        throw new Error('Route should be a string');
      }

      if(route.startsWith('/')) {
        parseRoute(route, routes[route]);
      }
      else if(route.startsWith('_')) {
        parseExtraRoutes(route, routes[route]);
      }

    } catch(e) {
      // @todo up error to front
      console.log(e);
      debug(e.message);
    }
  });
}

/**
 * @param parentRoute
 * @param config
 */
function parseRoute(parentRoute, config) {
  if(typeof config !== 'object') {
    throw new Error(`Route config malformed, it should be an object. ${typeof config} given`);
  }

  Object.keys(config).map((key) => {
    if(configuration.METHODS.indexOf(key.toUpperCase()) !== -1) {
      Routes.push(extractRoute(parentRoute, key, config));
    }
    else if(key.startsWith('/')) {
      parseRoute(parentRoute+key, config[key]);
    }
    else {
      throw new Error(`Syntax malformed : (${parentRoute})`);
    }
  });
}

function extractRoute(parentRoute, key, config) {
  if(typeof config[key] === 'object') {
    return extractRouteFromConfig(parentRoute, Object.assign({method: key}, config[key]));
  } else if(typeof config[key] === 'string') {
    return extractRouteFromString(parentRoute, key, config);
  } else {
    throw new Error(`Syntax malformed : ${parentRoute}`);
  }
}

/**
 * @param name
 * @param config
 */
function parseExtraRoutes(name, config) {
  if(name === '_errors') {
    parseErrorRoutes(`/${name}`, config);
  } else if(name === '_static') {
    parseStaticRoutes(config);
  } else if(name === '_middlewares') {
    parseMiddleware(config);
  } else if(name === '_views') {
    parseViews(config);
  }
}

/**
 * Parse middlewares
 * @param config
 */
function parseMiddleware(config) {
  for(const i in config) {
    if(config[i].target === 'init') {
      for(const j in config[i].action) {
        let controller = config[i].action[j], action = null;
        if(config[i].action[j].indexOf('#') !== -1) {
          [controller, action] = config[i].action[j].split('#');
        }

        GlobalMiddleWares.push({
          controller,
          action,
          debug: {
            target: 'all',
            controller: config[i].action[j],
            action: action,
          }
        });
      }
    } else if(config[i].target === '*') {
      for(const j in config[i].action) {
        extractMiddleware(config[i].action[j], ['*']);
      }
    }
    else {
      for(const j in config[i].action) {
        extractMiddleware(config[i].action[j], config[i].target);
      }
    }
  }
}

/**
 * Generate static routes
 * @param config
 */
function parseStaticRoutes(config) {
  Object.keys(config).map((key) => {
    StaticRoutes.push({
      method: 'get',
      route: key,
      controller: config[key].target,
      action: '*',
      options: config[key].options,
      generated: true,
      debug: {
        controller: config[key].target,
        action: '*'
      }
    });
  });
}

/**
 * @param name
 * @param config
 */
function parseErrorRoutes(name, config) {
  Object.keys(config).map((key) => {
    Object.keys(config[key]).map((method) => {
      if(key.indexOf('*') !== -1) {
        const status = getAllHttpStatusFrom(key.charAt(0));
        for(const i in status) {
          const route = extractRoute(`${name}/${status[i].status}`, method, Object.assign(config[key], {
            extra: {
              status: parseInt(status[i].status)
            }
          }));
          Routes.push(route);
          ErrorRoutes.push(route);
        }
      } else {
        const route = extractRoute(`${name}/${key}`, method, Object.assign(config[key], {
          method: key,
          extra: {
            status: parseInt(key)
          }
        }));
        Routes.push(route);
        ErrorRoutes.push(route);
      }
    });
  });
}

/**
 * @todo to tests
 * @param config
 */
function parseViews(config) {
  for(const i in config) {
    ViewEngine.push({
      views: config[i].directory,
      engine: config[i].engine,
      controller: config[i].target,
    });
  }
}

/**
 * Generate route with configuration
 * @param route
 * @param config
 * @return {{route: *, method, controller: *, action: *, errorHandler: (null|*|string), middleware: *, generated: boolean}}
 */
function extractRouteFromConfig(route, config) {
  if(!config.controller) {
    throw new Error('Controller is missing');
  }

  let controller = null, action = null, dController = null, dAction = null;
  let generated = false;

  if(typeof config.controller === 'string') {
    [controller, action] = config.controller.split('#');
    dController = controller;
    dAction = action;
  } else if(typeof config.controller === 'function') {
    action = config.controller;
    dController = 'Anonymous';
    dAction = 'N/A';
    generated = true;
  } else {
    throw new Error(`Controller malformed. String or function expected, ${typeof config.controller} givent.`);
  }

  if(config.middlewares) {
    for(const i in config.middlewares) {
      extractMiddleware(config.middlewares[i], [route]);
    }
  }

  if(config.errorHandler) {
    extractErrorHandler(route, config.errorHandler);
  }

  return {
    route,
    method: config.method,
    controller,
    action,
    generated,
    extra: config.extra,
    debug: {
      controller: dController,
      action: dAction,
    }
  };
}

/**
 * Generate route from string, whitout configuration
 * @param route
 * @param method
 * @param config
 * @return {{route: *, method: *, controller, action, generated: boolean}}
 */
function extractRouteFromString(route, method, config) {
  const [controller, action] = config[method].split('#');
  return {
    route,
    method,
    controller,
    action,
    generated: false,
    extra: config.extra,
    debug: {
      controller: controller,
      action: action,
    }
  };
}

/**
 * Extract middleware
 * @param name
 * @param targets
 */
function extractMiddleware(name, targets) {
  for(const i in targets) {
    if(name.indexOf('#') !== -1) {
      const [controller, action] = name.split('#');
      MiddleWares.push({
        target: targets[i],
        controller,
        action,
      });
    } else {
      MiddleWares.push({
        target: targets[i],
        controller: name,
      });
    }
  }
}

/**
 * Extract error handler
 * @param target
 * @param name
 */
function extractErrorHandler(target, name) {
  if(name.indexOf('#') !== -1) {
    const [controller, action] = name.split('#');
    ErrorsHandler.push({
      target: target,
      controller,
      action,
    });
  } else {
    ErrorsHandler.push({
      target: target,
      controller: name,
    });
  }
}

/**
 * Generate controller of all routes & middlewares
 */
function generate() {
  for(const i in Routes) {
    Routes[i] = generateController(path.controllers, Routes[i]);
  }

  for(const i in MiddleWares) {
    MiddleWares[i] = generateController(path.middlewares, MiddleWares[i]);
  }

  for(const i in GlobalMiddleWares) {
    GlobalMiddleWares[i] = generateController(path.middlewares, GlobalMiddleWares[i]);
  }

  for(const i in ErrorsHandler) {
    ErrorsHandler[i] = generateController(path.errorHandler, ErrorsHandler[i]);
  }
}

/**
 * Generate controller
 * @param _path
 * @param config
 * @return {*}
 */
function generateController(_path, config) {
  if(config.controller === null) {
    delete config.controller;
    config.generated = true;
    return config;
  }

  config.action = getAction(_path+config.controller, config.action);
  delete config.controller;
  config.generated = true;
  return config;
}


/**
 * @param _controller
 * @param _action
 * @return {{controller: *, action: *}}
 */
function getAction(_controller, _action) {
  const controller = require(_controller);
  let action = null;

  if(!controller) {
    throw new Error(`${controller} does not exists`);
  }

  if(!_action) {
    return controller;
  }

  if(typeof controller === 'function' && _action) {
    console.log(`Warning! You try to call action while controller is a function. ${_controller}#${_action}`.red);
  }

  if(typeof controller === 'object') {
    action = controller[_action];

    if(typeof action !== 'function') {
      throw new Error(`${controller}#${action} is not a function`);
    }

    return action;
  }
  else if(typeof controller === 'function') {
    return controller;
  }

  return action;
}







/**
 * @param method
 * @param route
 * @param config
 * @param extra
 */
function generateRoute2(method, route, config, extra) {
  if(typeof config === 'object') {
    return generateRouteFromObject(method, route, config, extra);
  }
  else if(typeof config === 'string' && config.indexOf('#') !== -1) {
    return generateRouteFromString(method, route, config, extra);
  }
  else {
    throw new Error(`Controllers route is malformed : ${config}`);
  }
}

function generateRouteFromString2(method, route, config, extra) {
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
function generateRouteFromObject(method, route, config, extra) {

}



/**
 * @param controllers
 */
function generateController2(controllers) {
  const arrayToScan = [Routes, ErrorRoutes, MiddleWares, GlobalMiddleWares, ViewEngine];
  for(const i in arrayToScan) {
    for(const k in arrayToScan[i]) {
      try {
        assignControllerToRoute(controllers, arrayToScan[i][k]);
      } catch(e) {
        console.log(e);
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
  else if(typeof ctrl === 'function') {
    fnctn = ctrl;
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























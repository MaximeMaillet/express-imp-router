const {isObject, isFunction, isString, isMethod} = require('../lib/route-utils');
const LEVEL = require('../config/middleware').LEVEL;
const METHOD = require('../config/methods');
const errors = require('../config/errors');

module.exports = {
  extract,
};

function extract(mainConfig, routesConfig) {
  const middlewares = find((mainConfig.root ? mainConfig.root : ''), routesConfig);
  for(const i in middlewares) {
    middlewares[i].classPath = mainConfig.middlewares;
  }
  return dedupe(checkValid(middlewares));
}

/**
 * @param middlewares
 * @returns {Array}
 */
function dedupe(middlewares) {
  const uniqueMiddlewares = [];
  let index=-1;
  for(const i in middlewares) {
    if((index = uniqueMiddlewares.map(item => item.method+item.route+item.level).indexOf(middlewares[i].method+middlewares[i].route+middlewares[i].level)) !== -1) {
      uniqueMiddlewares[index].controllers.push({
        ...middlewares[i],
      });
    } else {
      uniqueMiddlewares.push({
        route: middlewares[i].route,
        level: middlewares[i].level,
        inheritance: middlewares[i].inheritance,
        method: middlewares[i].method,
        status: middlewares[i].status,
        controllers: [middlewares[i]],
        generated: false,
        debug: middlewares[i].debug,
      });
    }
  }
  return uniqueMiddlewares;
}

/**
 * @param middlewares
 * @returns {*}
 */
function checkValid(middlewares) {
  for(const i in middlewares) {
    let status = 0;
    if(typeof middlewares[i].route !== 'string' || !middlewares[i].route.startsWith('/')) {
      status = status | errors.MIDDLEWARE.ROUTE_MALFORMED;
    }

    if(middlewares[i].level !== LEVEL.ERROR && middlewares[i].method === 'N/A') {
      status = status | errors.MIDDLEWARE.METHOD_NOT_EXISTS;
    }

    if(!middlewares[i].controller) {
      status = status | errors.MIDDLEWARE.CONTROLLER_FAILED;
    }

    if(!middlewares[i].action) {
      status = status | errors.MIDDLEWARE.ACTION_FAILED;
    }

    middlewares[i].status = status;
  }

  return middlewares;
}

/**
 * @param rootPath
 * @param config
 * @return {Array}
 */
function find(rootPath, config) {
  let middlewares = [];
  Object.keys(config).map((route) => {
    if(route === '_middleware_') {
      if(Array.isArray(config[route])) {
        for(const i in config[route]) {
          middlewares = middlewares.concat(
            extractMiddleware(
              rootPath,
              {
                ...config[route][i],
                method: config.method ? config.method : config[route][i].method ? config[route][i].method : null,
              }
            )
          );
        }
      } else {
        middlewares = middlewares.concat(
          extractMiddleware(
            rootPath,
            {
              ...config[route],
              method: config.method ? config.method : config[route].method ? config[route].method : null,
            }
          )
        );
      }
    } else if(route.startsWith('/')) {
      middlewares = middlewares.concat(find(rootPath+route, config[route]));
    } else if(isMethod(route) && isObject(config[route])) {
      middlewares = middlewares.concat(find(rootPath, {
        ...config[route],
        ...{method: route},
      }));
    }
  });

  return middlewares;
}

/**
 * @param route
 * @param config
 * @return {Array}
 */
function extractMiddleware(route, config) {
  let middlewares = [];

  if(!isObject(config)) {
    throw new Error(`"_middleware_" should be an object : ${typeof config} founded for ${route}`);
  }

  if(config.level !== LEVEL.ERROR && !Array.isArray(config.controllers)) {
    throw new Error(`"_middleware_ > controllers" should be an array : ${typeof config.controllers} founded for ${route}`);
  }

  for(const i in config.controllers) {
    const _middlewares = from(route, config.controllers[i]);
    for(const j in _middlewares){
      _middlewares[j].inheritance = config.inheritance || 'none';
    }
    middlewares = middlewares.concat(_middlewares);
  }

  for(const i in middlewares) {
    middlewares[i] = {
      ...middlewares[i],
      level: config.level ? config.level : LEVEL.DEFAULT,
      method: config.method ? config.method : METHOD.ALL,
      status: 0,
    };
  }

  return middlewares;
}

/**
 * @param route
 * @param config
 * @return []
 */
function from(route, config) {
  if(isString(config)) {
    return fromString(route, config);
  } else if(isFunction(config)) {
    return fromFunction(route, config);
  } else if(isObject(config)) {
    return fromObject(route, config);
  }

  return [];
}

/**
 * @param route
 * @param config
 * @return []
 */
function fromString(route, config) {
  const [controller, action] = config.split('#');
  return [{
    route,
    controller,
    action,
    generated: false,
    level: LEVEL.DEFAULT,
    debug: {},
  }];
}

/**
 * @param route
 * @param config
 * @return []
 */
function fromObject(route, config) {
  const {controller, action, level} = config;
  if(Array.isArray(controller)) {
    const middlewares = [];
    for(const i in controller) {
      middlewares.push({
        ...from(route, controller[i]),
        generated: false,
        level: level ? level : LEVEL.DEFAULT,
      });
    }
    return middlewares;
  } else {
    return [{
      route,
      controller,
      action,
      generated: false,
      level: level ? level : LEVEL.DEFAULT,
      debug: {},
    }];
  }
}

/**
 * @param route
 * @param config
 * @return []
 */
function fromFunction(route, config) {
  return [{
    route,
    controller: '_ANON_',
    action: config,
    generated: false,
    level: LEVEL.DEFAULT,
    debug: {},
  }];
}

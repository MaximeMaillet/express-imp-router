const {isObject, isFunction, isString, isMethod} = require('../lib/route-utils');
const LEVEL = require('../config/middleware');
const METHOD = require('../config/methods');

module.exports = {
  extract,
};

function extract(mainConfig, routesConfig, isDebug) {
  const middlewares = find('', routesConfig);
  for(const i in middlewares) {
    middlewares[i].classPath = mainConfig.middlewares;
    middlewares[i].find = false;
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
          middlewares = middlewares.concat(extractMiddleware(rootPath, {
            ...config[route][i],
            method: config.method ? config.method : config[route][i].method ? config[route][i].method : null,
          }));
        }
      } else {
        middlewares = middlewares.concat(extractMiddleware(rootPath, {
          ...config[route],
          method: config.method ? config.method : config[route].method ? config[route].method : null,
        }));
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

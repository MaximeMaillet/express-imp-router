const {isObject, isFunction, isString, isMethod} = require('../lib/route-utils');
const LEVEL = require('../config/middleware');
const METHOD = require('../config/methods');

module.exports = {
  extract,
};

function extract(mainConfig, routesConfig, isDebug) {
  let middlewares = find('', routesConfig);

  for(let i in middlewares) {
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
      middlewares = middlewares.concat(extractMiddleware(rootPath, {
        ...config[route],
        method: config.method ? config.method : config[route].method ? config[route].method : null,
      }));
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


  switch(config.level) {
    case LEVEL.ERROR:
      middlewares = middlewares.concat(from(route, config.controller));
      break;
    case LEVEL.APP:
      for(let i in config.controllers) {
        middlewares = middlewares.concat(from(route, config.controllers[i]));
      }
      break;
  }

  for(let i in middlewares) {
    middlewares[i] = {
      ...middlewares[i],
      level: config.level ? config.level : LEVEL.DEFAULT,
      method: config.method ? config.method : METHOD.ALL,
    }
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
    for(let i in controller) {
      middlewares.push({
        ...from(route, controller[i]),
        generated: false,
        level: level ? level : LEVEL.DEFAULT,
      })
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
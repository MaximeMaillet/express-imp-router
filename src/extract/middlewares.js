const {isObject, isFunction, isString} = require('../lib/route-utils');
const {TYPE} = require('../config/middleware');

function fromString(route, config) {
  const [controller, action] = config.split('#');
  return {
    method: 'all',
    route,
    controller,
    action,
    generated: false,
    type: TYPE.APP,
    debug: {},
  };
}

function fromObject(route, config) {
  const {controller, action, type} = config;
  return {
    method: 'all',
    route,
    controller,
    action,
    generated: false,
    type: type ? type : TYPE.APP,
    debug: {},
  };
}

function fromFunction(route, config) {
  return {
    method: 'all',
    route,
    controller: '_ANON_',
    action: config,
    generated: false,
    type: TYPE.APP,
    debug: {},
  };
}

function extractMiddleware(route, config) {
  let middlewares = [];
  if(Array.isArray(config)) {
    for(let i in config) {
      middlewares = middlewares.concat(extractMiddleware(route, config[i]));
    }
  } else if(isString(config)) {
    middlewares.push(fromString(route, config));
  } else if(isObject(config)) {
    middlewares.push(fromObject(route, config));
  } else if(isFunction(config)) {
    middlewares.push(fromFunction(route, config));
  }

  return middlewares;
}

function find(rootPath, config) {
  let middlewares = [];
  Object.keys(config).map((route) => {
    if(route === '_middleware_') {
      middlewares = middlewares.concat(extractMiddleware(rootPath, config[route]));
    } else if(route.startsWith('/')) {
      middlewares = middlewares.concat(find(rootPath+route, config[route]));
    }
  });

  return middlewares;
}

function extract(mainConfig, routesConfig, isDebug) {
  let middlewares = find('', routesConfig);

  for(let i in middlewares) {
    middlewares[i].classPath = mainConfig.middlewares;
    middlewares[i].find = false;
  }

  return middlewares;
}

module.exports = {
  extract,
};
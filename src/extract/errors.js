const {isObject, isFunction, isString} = require('../lib/route-utils');
const levelErrors = Object.values(require('../config/errors'));

module.exports = {
  route
};

function route(mainConfig, routeConfig, isDebug) {
  return find('', routeConfig);
}

function find(rootPath, config) {
  const errors = [];
  Object.keys(config).map((route) => {
    if(levelErrors.indexOf(route.toLowerCase()) !== -1) {
      errors.push({
        ...from(rootPath+route, config[route]),
        level: route.toLowerCase(),
      });
    }
  });
  return errors;
}

/**
 * @param route
 * @param config
 * @return {}
 */
function from(route, config) {
  if(isString(config)) {
    return fromString(route, config);
  } else if(isFunction(config)) {
    return fromFunction(route, config);
  } else if(isObject(config)) {
    return fromObject(route, config);
  }

  return {};
}

/**
 * @param route
 * @param config
 * @return {}
 */
function fromString(route, config) {
  const [controller, action] = config.split('#');
  return {
    route,
    controller,
    action,
    generated: false,
    debug: {},
  };
}

/**
 * @param route
 * @param config
 * @return {}
 */
function fromObject(route, config) {
  const {controller, action} = config;
  return {
    route,
    controller,
    action,
    generated: false,
    debug: {},
  };
}

/**
 * @param route
 * @param config
 * @return {}
 */
function fromFunction(route, config) {
  return {
    route,
    controller: '_ANON_',
    action: config,
    generated: false,
    debug: {},
  };
}
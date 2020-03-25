const debug = require('debug')('ExpressImpRouter.configuration');
const {isImpKeyword, isMethod} = require('./route-utils');

module.exports = {
  read,
};

function read(config) {
  debug('Check configuration');
  checkAll(config);
  debug('Configuration is OK');

  return config;
}

/**
 * Check all config
 * @param configAll
 */
function checkAll(configAll) {
  if(!Array.isArray(configAll)) {
    throw new Error('Config must be an array');
  }

  if(configAll.length === 0) {
    throw new Error('Config array is empty');
  }

  for(const i in configAll) {
    checkConfig(configAll[i]);
    flat(configAll[i]);
    checkKeywords(configAll[i].routes);
  }
}

/**
 * Check if config is OK
 * @param config
 */
function checkConfig(config) {
  if(!config || typeof config !== 'object') {
    throw new Error('Config are not defined, please referrer to documentation');
  }

  if(!config.controllers) {
    throw new Error('Controller path is not defined, please referrer to documentation');
  }

  if(!config.routes) {
    throw new Error('Routes JSON file is not defined, please referrer to documentation');
  }

  if((typeof config.routes !== 'object' && typeof config.routes !== 'string') || Array.isArray(config.routes)) {
    throw new Error('Routes JSON is invalid. It should be a path (String) or JSON object (Object)')
  }
}

/**
 * Check keyword in config route
 * @param config
 */
function checkKeywords(config) {
  Object.keys(config).map((route) => {

    if(route.startsWith('/')) {
      checkKeywords(config[route]);
    } else if (!isImpKeyword(route) && !isMethod(route)) {
      console.log(`WARNING : Potential error with keyword ${route}`);
    }
  });
}

/**
 * Flat config
 * @param config
 */
function flat(config) {
  if(config.controllers && !config.controllers.endsWith('/')) {
    config.controllers += '/';
  }

  if(config.middlewares && !config.middlewares.endsWith('/')) {
    config.middlewares += '/';
  }

  if (typeof config.routes !== 'object') {
    config.routes = require(config.routes);
  }
}

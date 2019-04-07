const debug = require('debug')('ExpressImpRouter.configuration');

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

  for(const i in configAll) {
    checkConfig(configAll[i]);
    flat(configAll[i]);
  }
}

/**
 * Check if config is OK
 * @param config
 */
function checkConfig(config) {
  if(!config) {
    throw new Error('Config are not defined, please referrer to documentation');
  }

  if(!config.routes) {
    throw new Error('Routes JSON file is not defined, please referrer to documentation');
  }

  if(typeof config.routes !== 'object' && typeof config.routes !== 'string') {
    throw new Error('Routes JSON is invalid. It should be a path (String) or JSON object (Object)')
  }

  if(!config.controllers) {
    throw new Error('Controllers directory is not defined');
  }
}

/**
 * Flat config
 * @param config
 */
function flat(config) {
  if(!config.controllers.endsWith('/')) {
    config.controllers += '/';
  }

  if(config.services && !config.services.endsWith('/')) {
    config.services += '/';
  }

  if(config.middlewares && !config.middlewares.endsWith('/')) {
    config.middlewares += '/';
  }
}
const middlewareExtractor = require('../extract/middlewares');
const debug = require('debug')('ExpressImpRouter.routes.extract');

let middlewares = [], isDebug = false;

module.exports = {
  extract,
  enableDebug,
  get,
};

function get(route) {
  return middlewares.filter((mid) => {
    if(route) {
      return mid.generated && route === mid.route;
    }

    return mid.generated;
  });
}

function extract(configAll) {
  debug('Start extract middlewares');

  let jsonRoutesConfig = null;
  for(let i in configAll) {
    if(typeof configAll[i].routes === 'object') {
      jsonRoutesConfig = configAll[i].routes;
    } else {
      jsonRoutesConfig = require(configAll[i].routes);
    }

    middlewares = middlewares.concat(middlewareExtractor.extract(configAll[i], jsonRoutesConfig, isDebug));
  }
  debug('Extract middlewares : done');
  return middlewares;
}

function enableDebug() {
  isDebug = true;
}
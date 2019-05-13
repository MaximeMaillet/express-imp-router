const middlewareExtractor = require('../extract/middlewares');
const debug = require('debug')('ExpressImpRouter.routes.extract');
const METHOD = require('../config/methods');

let middlewares = [], isDebug = false;

module.exports = {
  extract,
  enableDebug,
  get,
};

/**
 * Return middleware according to level, route and method
 * @param level
 * @param route
 * @param method
 * @return {*[]}
 */
function get(level, route, method) {
  return middlewares
    .filter(item => {
      let filterLevel, filterRoute, filterMethod = true;

      if(level) {
        filterLevel = item.level === level;
      }

      if(route) {
        if(item.inheritance === 'descending') {
          filterRoute = route.startsWith(item.route);
        } else {
          filterRoute = item.route === route;
        }
      }

      if(method) {
        if(Array.isArray(item.method)) {
          let isPresent = false;
          for(const i in item.method) {
            if(item.method[i].toUpperCase() === METHOD.ALL) {
              isPresent = true;
              break;
            }

            if(item.method[i].toUpperCase() === method.toUpperCase()) {
              isPresent = true;
              break;
            }
          }
          filterMethod = isPresent;
        } else {
          if(item.method.toUpperCase() !== METHOD.ALL && item.method.toUpperCase() !== method.toUpperCase()) {
            filterMethod = false;
          }
        }
      }

      return item.generated && filterMethod && filterLevel && filterRoute;
    })
    .map(item => {
      return {
        route: item.route,
        action: item.action,
      };
    })
  ;
}

/**
 * Extract middlewares
 * @param configAll
 * @return {Array|*[]}
 */
function extract(configAll) {
  debug('Start extract middlewares');

  for(const i in configAll) {
    middlewares = middlewares.concat(middlewareExtractor.extract(configAll[i], configAll[i].routes, isDebug));
  }
  debug('Extract middlewares : done');
  return middlewares;
}

/**
 * Enable debug mode
 */
function enableDebug() {
  isDebug = true;
}

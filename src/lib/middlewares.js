const middlewareExtractor = require('../extract/middlewares');
const debug = require('debug')('ExpressImpRouter.routes.extract');
const METHOD = require('../config/methods');

let middlewares = [], isDebug = false;

module.exports = {
  extract,
  enableDebug,
  get,
  purge,
};

/**
 * Return middleware according to level, route and method
 * @param level
 * @param route
 * @param method
 * @return {*[]}
 */
function get(level, route, method) {
  let middlewareReturn = middlewares
    .map(item => {
      item.actions = item.controllers.filter(controller => controller.generated).map(controller => controller.action);
      return item;
    })
    .filter(item => {
      let filterLevel = true, filterRoute = true, filterMethod = true;

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

      return filterMethod && filterLevel && filterRoute && item.actions.length > 0;
    })
  ;

  if(middlewareReturn.length === 0) {
    return [];
  }

  middlewareReturn = middlewareReturn
    .map((middleware) => {
      return middleware.controllers
        .map((item) => {
          return {
            priority: item.priority,
            action: item.action,
            inheritance: item.inheritance,
            route: item.route,
          };
        });
    })
  ;

  const finalMiddlewares = [];
  for(const i in middlewareReturn) {
    for(const j in middlewareReturn[i]) {
      finalMiddlewares.push(middlewareReturn[i][j]);
    }
  }

  finalMiddlewares.sort((a, b) => {
    return a.priority < b.priority ? 1 : -1;
  });

  return finalMiddlewares;
}

/**
 * Extract middlewares
 * @param configAll
 * @return {Array|*[]}
 */
function extract(configAll) {
  debug('Start extract middlewares');

  for(const i in configAll) {
    middlewares = middlewares.concat(middlewareExtractor.extract(configAll[i], configAll[i].routes));
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

/**
 * Purge middlewares
 */
function purge() {
  middlewares = [];
}
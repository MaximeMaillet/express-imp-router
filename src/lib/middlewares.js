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
  const scopedMiddlewares = [];
  for(const j in middlewares) {
    const index = scopedMiddlewares
      .map(item => item.route)
      .find(item => item.route === middlewares[j].route && middlewares[j].level === item.level);

    if(index === undefined) {
      scopedMiddlewares.push({
        ...middlewares[j],
        middlewares: [middlewares[j].action],
      });
    } else {
      scopedMiddlewares[index].middlewares.push(middlewares[j].action);
    }
  }

  return scopedMiddlewares.filter((mid) => {
    let filterMethod = true;
    if(mid.method && method) {
      if(Array.isArray(mid.method)) {
        let isPresent = false;
        for(const i in mid.method) {
          if(mid.method[i].toUpperCase() === METHOD.ALL) {
            isPresent = true;
            break;
          }

          if(mid.method[i].toUpperCase() === method.toUpperCase()) {
            isPresent = true;
            break;
          }
        }
        filterMethod = isPresent;
      } else {
        if(mid.method.toUpperCase() !== METHOD.ALL && mid.method.toUpperCase() !== method.toUpperCase()) {
          filterMethod = false;
        }
      }
    }

    return mid.generated &&
      mid.level === level &&
      (route ? mid.route === route : true) &&
      filterMethod;
  });
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
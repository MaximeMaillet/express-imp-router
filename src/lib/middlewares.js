const middlewareExtractor = require('../extract/middlewares');
const debug = require('debug')('ExpressImpRouter.routes.extract');
const LEVEL = require('../config/middleware');
const METHOD = require('../config/methods');

let middlewares = [], isDebug = false;

module.exports = {
  extract,
  enableDebug,
  get,
};

function get(level, route, method) {
  let scopedMiddlewares = [];
  for(let j in middlewares) {
    let index = scopedMiddlewares.map(item => item.route).indexOf(middlewares[j].route);
    if(index === -1) {
      scopedMiddlewares.push({
        ...middlewares[j],
        middlewares: [middlewares[j].action],
      });
    } else {
      scopedMiddlewares[index].middlewares.push(middlewares[j].action);
    }
    // if(middlewares[j].level === LEVEL.APP) {
    //
    // }
  }

  return scopedMiddlewares.filter((mid) => {
    let filterMethod = true;
    if(mid.method && method) {
      if(Array.isArray(mid.method)) {
        let isPresent = false;
        for(let i in mid.method) {
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
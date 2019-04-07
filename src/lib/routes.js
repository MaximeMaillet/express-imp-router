const debug = require('debug')('ExpressImpRouter.routes');
const routeExtractor = require('../extract/routes');
const actionsGenerator = require('./actions-generator');

let isDebug = false;
let routes = [];

module.exports = {
  extract,
  generate,
  enableDebug,
  get,
};

function get(debug) {
  debug = debug || false;

  if(!debug) {
    return routes.filter(route => route.generated);
  } else {
    const emoji = require('node-emoji');
    return routes.map((obj) => {
      let status = null, {message} = obj;

      if(obj.generated) {
        status = `${emoji.get(':white_check_mark:')}  Route generated : `.green;
        message = 'N/A';
      } else {
        status = `${emoji.get(':x:')}  Route not generated : `.red;
      }

      return {
        status,
        method: obj.method.toUpperCase(),
        route: obj.route,
        controller: obj.debug.controller,
        action: obj.debug.action,
        message
      };
    });
  }
  // const newRoutes = [];
  // for(let i in routes) {
  //   if(!newRoutes[routes[i].route]) {
  //     newRoutes[routes[i].route] = [];
  //   }
  //
  //   newRoutes[routes[i].route].push(routes[i]);
  // }
  //
  // for(let i in newRoutes) {
  //   newRoutes[i] = newRoutes[i].filter(route => route.generated);
  // }
  //
  // return newRoutes;
}

/**
 * Generate routes
 */
function generate() {
  debug('Start generating routes');
  for(let i in routes) {
    generateRoute(routes[i]);
  }
  debug('Routes generating : done');
}

/**
 * @param route
 * @return {*}
 */
function generateRoute(route) {
  if(route.controller === '_ANON_') {
    route.generated = true;
    return route;
  }

  try {
    route = actionsGenerator.generate(route);
    route.generated = true;
  } catch(e) {
    const message = `"${route.method.toUpperCase()} ${route.route}" is ignored. Reason : ${e.message}`;
    debug(message);
    if(isDebug) {
      console.warn(message);
    }
  }

  return route;
}

/**
 * @param configAll
 * @return {Array}
 */
function extract(configAll) {
  debug('Start extract routes');

  let jsonRoutesConfig = null;
  for(let i in configAll) {
    if(typeof configAll[i].routes === 'object') {
      jsonRoutesConfig = configAll[i].routes;
    } else {
      jsonRoutesConfig = require(configAll[i].routes);
    }

    routes = routes.concat(routeExtractor.route(configAll[i], jsonRoutesConfig, isDebug));
  }
  debug('Extract routes : done');
  return routes;
}

/**
 * Enable debug mode
 */
function enableDebug() {
  isDebug = true;
}
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
    const colors = require('colors');
    return routes.map((obj) => {
      let color = colors.white, status = '';

      colors.setTheme({
        warn: 'yellow',
        error: 'red'
      });

      if(!obj.generated) {
        color = colors.red;
        status = 'Route not generated';
      } else {
        color = colors.green;
        status = `Route generated :`;
        if(obj.debug.level) {
          color = colors[obj.debug.level];
        }
      }

      return {
        status: color(status),
        method: color(obj.method.toUpperCase()),
        route: color(obj.route),
        controller: color(obj.debug.controller ? obj.debug.controller : 'N/A'),
        action: color(obj.debug.action ? obj.debug.action : 'N/A'),
        message: color(obj.debug.message ? obj.debug.message : 'N/A'),
      };
    });
  }
}

/**
 * Generate routes
 */
function generate() {
  debug('Start generating routes');
  for(let i in routes) {
    generateRoute(routes[i]);
  }

  dedupe();

  debug('Routes generating : done');
}

/**
 * Dedupe routes
 */
function dedupe() {
  debug('Start deduping');
  const routeValidated = [];
  let index = -1;

  for(let i in routes) {
    if(routes[i].static) {
      continue;
    }
    let strToCompare = routes[i].method+routes[i].route;
    let strToCompareHard = routes[i].method+routes[i].route.replace(/(\(.+\))/gi, '');

    if((index = routeValidated.indexOf(strToCompare)) !== -1) {
      routes[i].debug.message = `This route already exists : ${routes[i].method.toUpperCase()} ${routes[i].route}`;
      routes[i].debug.level = 'error';
      routes[i].generated = false;
    } else {
      if((index = routeValidated.indexOf(strToCompareHard)) !== -1) {
        routes[i].debug.message = `Maybe there is similar route : ${routes[i].method.toUpperCase()} ${routes[i].route} :: ${routeValidated[index].replace(/([a-z]+)(\/.+)/, '$1').toUpperCase()} ${routeValidated[index].replace(/([a-z]+)(\/.+)/, '$2')}`;
        routes[i].debug.level = 'warn';
        routes[i].generated = true;
      }

      routeValidated.push(routes[i].method+routes[i].route);
    }
  }

  debug('Deduping : done');
}

/**
 * @param route
 * @return {*}
 */
function generateRoute(route) {
  if(route.controller === '_ANON_') {
    if(route.static) {
      try {
        route = actionsGenerator.generateStatic(route);
        route.generated = true;
        return route;
      } catch(e) {
        const message = `"${route.method.toUpperCase()} ${route.route}" is ignored. Reason : ${e.message}`;
        if(!route.debug.message) {
          route.debug.message = message;
        }
        debug(message);
        if(isDebug) {
          console.warn(message);
        }
        return route;
      }
    }
    route.generated = true;
    return route;
  }

  try {
    route = actionsGenerator.generate(route);
    route.generated = true;
  } catch(e) {
    const message = `"${route.method.toUpperCase()} ${route.route}" is ignored. Reason : ${e.message}`;
    if(!route.debug.message) {
      route.debug.message = message;
    }
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
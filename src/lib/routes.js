const debug = require('debug')('ExpressImpRouter.routes');
const routeExtractor = require('../extract/routes');

let isDebug = false;
let routes = [];

module.exports = {
  extract,
  enableDebug,
  get,
};

function get(debug) {
  debug = debug || false;

  if(!debug) {
    return routes.filter(route => route.generated);
  } else {
    const colors = require('colors');
    colors.setTheme({
      warn: 'yellow',
      error: 'red'
    });
    let color = colors.white, status = '';

    const debugRoutes = [];
    let currentRoutes = [];
    let currentConfigName = null;

    routes
    .sort((a, b) => {
      const textA = a.config_name.toUpperCase();
      const textB = b.config_name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })
    .map((obj) => {
      if(!obj.generated) {
        color = colors.red;
        status = 'Route not generated';
      } else {
        color = colors.green;
        status = 'Route generated :';
        if(obj.debug.level) {
          color = colors[obj.debug.level];
        }
      }

      if(!currentConfigName) {
        currentConfigName = obj.config_name;
      }

      if(currentConfigName && currentConfigName !== obj.config_name) {
        debugRoutes.push(currentRoutes);
        currentRoutes = [];
        currentConfigName = obj.config_name;
      }

      currentRoutes.push({
        status: color(status),
        method: color(obj.method.toUpperCase()),
        route: color(obj.route),
        controller: color(obj.debug.controller ? obj.debug.controller : 'N/A'),
        action: color(obj.debug.action ? obj.debug.action : 'N/A'),
        message: color(obj.debug.message ? obj.debug.message : 'N/A'),
      });
    });

    debugRoutes.push(currentRoutes);
    return debugRoutes;
  }
}

/**
 * @param configAll
 * @return {Array}
 */
function extract(configAll) {
  debug('Start extract routes');

  for(const i in configAll) {
    let scopeRoutes = [];
    scopeRoutes = scopeRoutes.concat(routeExtractor.route(configAll[i], configAll[i].routes, isDebug));

    if(configAll[i].config && configAll[i].config.route_mode === 'strict') {
      scopeRoutes = dedupe(scopeRoutes);
    }

    for(const j in scopeRoutes) {
      scopeRoutes[j].config_name = `Config${i}`;
    }

    routes = routes.concat(scopeRoutes);
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

/**
 * Dedupe routes
 */
function dedupe(scopeRoutes) {
  debug('Start deduping');
  const routeValidated = [];
  let index = -1;

  for(const i in scopeRoutes) {
    if(scopeRoutes[i].static) {
      continue;
    }
    const strToCompare = scopeRoutes[i].method+scopeRoutes[i].route;
    const strToCompareHard = scopeRoutes[i].method+scopeRoutes[i].route.replace(/(\(.+\))/gi, '');

    if((index = routeValidated.indexOf(strToCompare)) !== -1) {
      scopeRoutes[i].debug.message = `This route already exists : ${scopeRoutes[i].method.toUpperCase()} ${scopeRoutes[i].route}`;
      scopeRoutes[i].debug.level = 'error';
      scopeRoutes[i].isDedupe = true;
    } else {
      if((index = routeValidated.indexOf(strToCompareHard)) !== -1) {
        scopeRoutes[i].debug.message = `Maybe there is similar route : ${scopeRoutes[i].method.toUpperCase()} ${scopeRoutes[i].route} :: ${routeValidated[index].replace(/([a-z]+)(\/.+)/, '$1').toUpperCase()} ${routeValidated[index].replace(/([a-z]+)(\/.+)/, '$2')}`;
        scopeRoutes[i].debug.level = 'warn';
        scopeRoutes[i].generated = true;
      }

      scopeRoutes[i].isDedupe = false;
      routeValidated.push(scopeRoutes[i].method+scopeRoutes[i].route);
    }
  }
  debug('Deduping : done');
  return scopeRoutes;
}
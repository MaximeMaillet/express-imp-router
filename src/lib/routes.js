const debug = require('debug')('ExpressImpRouter.routes');
const routeExtractor = require('../extract/routes');
const clone = require('lodash.clone');

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
    return routes.map((route) => {
      route.debug.controllersNotGenerated = route.controllers.filter(controller => !controller.generated);
      route.actions = route.controllers.filter(controller => controller.generated).map(controller => controller.action);
      return route;
    }).filter(item => item.actions && item.actions.length > 0);
  }

  const colors = require('colors');
  colors.setTheme({
    warn: 'yellow',
    error: 'red',
    success: 'green',
  });

  return [routes.map((route) => {
    let color = colors.white;
    const controllersName = [], actionsName = [], debugMessages = [];
    let controllersGenerated = 0, status = '';

    route.controllers.map((controller) => {
      if(controllersName.indexOf(controller.controllerName) === -1) {
        controllersName.push(controller.controllerName);
      }

      if(actionsName.indexOf(controller.actionName) === -1) {
        actionsName.push(controller.actionName);
      }

      if(controller.debug.message) {
        debugMessages.push(controller.debug.message);
      }

      if(controller.generated) {
        controllersGenerated++;
      }
    });

    if(controllersGenerated === 0) {
      color = colors.error;
      status = 'Nothing generated';
    } else if(controllersGenerated !== route.controllers.length) {
      color = colors.warn;
      status = 'Partial generated';
    } else {
      color = colors.success;
      status = 'Generated';
    }

    return {
      status: color(status),
      method: color(route.method.toUpperCase()),
      route: color(route.route),
      controller: color(controllersName),
      action: color(actionsName),
      message: color(debugMessages),
    };
  })];
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

const debug = require('debug')('ExpressImpRouter.routes');
const routeExtractor = require('../extract/routes');

let isDebug = false;
let routes = [];

module.exports = {
  extract,
  enableDebug,
  get,
  purge,
};

/**
 * @param debug
 * @returns {*}
 */
function get(debug) {
  debug = debug || false;

  if(!debug) {
    return routes.map((route) => {
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
    let controllersGenerated = 0, statusMessage = '', statusController = 0;

    if(route.debug.message) {
      debugMessages.push(route.debug.message);
    }

    route.controllers.map((controller) => {
      statusController |= controller.status;

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

    if(route.status === 0) {
      if(statusController === 0) {
        color = colors.success;
        statusMessage = 'OK';
      } else {
        if(controllersGenerated === 0) {
          color = colors.error;
          statusMessage = 'Fail';
        } else if(controllersGenerated < route.controllers.length) {
          color = colors.warn;
          statusMessage = 'Partial fail';
        }
      }
    } else {
      color = colors.error;
      statusMessage = 'Fail';
    }

    return {
      status: color(statusMessage),
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

/**
 * Purge routes
 */
function purge() {
  routes = [];
}
const actionsGenerator = require('./actions-generator');
const debug = require('debug')('ExpressImpRouter.generator');

module.exports = {
  generate,
};

function generate(list) {
  for(const i in list) {
    generateItem(list[i]);
  }
}

/**
 * @param route
 * @return {*}
 */
function generateItem(route) {
  if(route.isDedupe) {
    return route;
  }

  if(route.controller === '_ANON_') {
    if(route.static) {
      try {
        route = actionsGenerator.generateStatic(route);
        route.generated = true;
        return route;
      } catch(e) {
        route.generated = false;
        const message = `"${route.method.toUpperCase()} ${route.route}" is ignored. Reason : ${e.message}`;
        if(!route.debug.message) {
          route.debug.message = message;
        }
        debug(message);
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
    route.generated = false;
    const message = `"${route.method.toUpperCase()} ${route.route}" is ignored. Reason : ${e.message}`;
    if(!route.debug.message) {
      route.debug.message = message;
    }
    debug(message);
  }

  return route;
}
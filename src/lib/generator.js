const actionsGenerator = require('./actions-generator');
const debug = require('debug')('ExpressImpRouter.generator');
const errors = require('../config/errors');

module.exports = {
  generate,
  generateOneRoute,
};

function generate(list) {
  for(const i in list) {
    generateOneRoute(list[i]);
  }
}

/**
 * @param route
 * @return {*}
 */
function generateOneRoute(route) {
  for(const i in route.controllers) {
    if(route.controllers[i].controller === '_ANON_') {
      if(typeof route.controllers[i].action === 'function') {
        route.controllers[i].generated = true;
      } else {
        route.controllers[i].generated = false;
        route.controllers[i].status = route.controllers[i].status | errors.CONTROLLER.NO_ACTION;
      }

      continue;
    }


    try {
      actionsGenerator.generate(route.controllers[i]);
      route.controllers[i].generated = true;
    } catch(e) {
      debug(e.message);
      route.controllers[i].generated = false;
      route.controllers[i].debug.message = e.message;
      if(e.type === 'controller') {
        route.controllers[i].status = route.controllers[i].status | errors.CONTROLLER.CONTROLLER_FAILED;
      } else if(e.type === 'action') {
        route.controllers[i].status = route.controllers[i].status | errors.CONTROLLER.ACTION_FAILED;
      }
    }
  }

  // if(route.controller === '_ANON_') {
  //   if(route.static) {
  //     try {
  //       route = actionsGenerator.generateStatic(route);
  //       route.generated = true;
  //       return route;
  //     } catch(e) {
  //       route.generated = false;
  //       const message = `"${route.method.toUpperCase()} ${route.route}" is ignored. Reason : ${e.message}`;
  //       if(!route.debug.message) {
  //         route.debug.message = message;
  //       }
  //       debug(message);
  //       return route;
  //     }
  //   }
  //   return route;
  // }

  // console.log(route);
  return route;
}
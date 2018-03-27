function fromString(route, method, config) {
  const [controller, action] = config.split('#');
  return {
    route,
    method,
    controller,
    action,
    generated: false,
    debug: {
      controller: controller,
      action: action,
    }
  };
}

function fromObject(route, config) {
  if(!config.controller && !config.action) {
    throw new Error(`Controller is missing for route : ${route}`);
  }

  const {method, controller, action, ...rest} = config;

  let fController = null, fAction = null, dController = null, dAction = null;
  let generated = false;

  if(typeof controller === 'function') {
    fController = null;
    fAction = controller;
    dController = 'Anonymous';
    generated = true;
  }
  else if(typeof controller === 'string') {
    if(controller.indexOf('#') !== -1) {
      [fController, fAction] = config.controller.split('#');
      dController = fController;
      dAction = fAction;
    } else {
      fController = dController = controller;
      fAction = dAction = action;
    }
  }
  else if(typeof action === 'function') {
    fController = null;
    fAction = action;
    dController = 'Anonymous';
    generated = true;
  }
  else {
    throw new Error(`Controller malformed. String or function expected, ${typeof controller} given.`);
  }

  return {
    ...rest,
    route,
    method,
    controller: fController,
    action: fAction,
    generated,
    debug: {
      controller: dController,
      action: dAction,
    }
  };
}

function fromFunction(route, method, _function) {
  return {
    route,
    method,
    action: _function,
    generated: true,
    debug: {
      controller: 'Anonymous',
    }
  };
}

module.exports = {
  fromString,
  fromObject,
  fromFunction,
};
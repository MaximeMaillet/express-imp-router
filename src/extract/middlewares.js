function formatMiddleware(middleware) {
  if ((typeof middleware) === 'string' && middleware.indexOf('#') !== -1) {
    const [controller, action] = middleware.split('#');
    return {
      controller,
      action,
      generated: false,
      type: 'use',
    };
  } else if ((typeof middleware) === 'object') {
    return {
      controller: middleware.controller,
      action: middleware.action,
      generated: false,
      type: middleware.type ? middleware.type : 'use',
    };
  } else {
    throw new Error(`Syntax malformed for middleware : ${middleware}`);
  }
}

function fromArrayForRoute(route, middlewares) {
  const _middlewares = [];
  for(const i in middlewares) {
    const midd = formatMiddleware(middlewares[i]);
    midd.target = route;
    _middlewares.push(midd);
  }

  return _middlewares;
}

function fromArray(middlewares) {
  const _middlewares = [];
  for(const i in middlewares) {
    _middlewares.push(formatMiddleware(middlewares[i]));
  }

  return _middlewares;
}

module.exports = {
  fromArray,
  fromArrayForRoute,
};
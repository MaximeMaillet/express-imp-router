const { expect } = require('chai');
const routeExtract = require('../../../src/extract/routes');
const router = require('../../../index');

describe('Extract routes', () => {
  const isDebug = true;
  const mainConfig = {
    controllers: `${__dirname}/controllers1`,
  };

  const expectedOneRouteWith = (method, result, isAnonymous) => {
    isAnonymous = isAnonymous || false;
    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.an('object');
    expect(result[0].method).to.equal(method);
    expect(result[0].route).to.equal('/');
    expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
    if(isAnonymous) {
      expect(result[0].controllers[0].controller).to.equal('_ANON_');
      expect(result[0].controllers[0].action).to.an('function');
    } else {
      expect(result[0].controllers[0].controller).to.equal('HomeController');
      expect(result[0].controllers[0].action).to.equal('home');
    }
    expect(result[0].controllers[0].classPath).to.equal(mainConfig.controllers);
  };

  describe('from string', () => {
    it('should return array with 2 route, 2 controllers', () => {
      mainConfig['routes'] = {
        '/string': {
          get: 'HomeController#home',
          '/second': {
            get: ['HomeController#home', 'HomeController#home2']
          }
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expect(result).to.be.an('array').that.have.lengthOf(2);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/string');
      expect(result[0].controllers[0].controller).to.equal('HomeController');
      expect(result[0].controllers[0].action).to.equal('home');
      expect(result[0].controllers[0].classPath).to.equal(mainConfig.controllers);

      expect(result[1]).to.an('object');
      expect(result[1].method).to.equal('get');
      expect(result[1].route).to.equal('/string/second');
      expect(result[1].controllers).to.be.an('array').that.have.lengthOf(2);
      expect(result[1].controllers[0].controller).to.equal('HomeController');
      expect(result[1].controllers[0].action).to.equal('home');
      expect(result[1].controllers[1].controller).to.equal('HomeController');
      expect(result[1].controllers[1].action).to.equal('home2');
      expect(result[1].controllers[0].classPath).to.equal(mainConfig.controllers);
    });

    it('should return array with one GET route', () => {
      mainConfig['routes'] = {
        '/': {
          get: ['HomeController#home']
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('get', result);
    });

    it('should return array with one POST route', () => {
      mainConfig['routes'] = {
        '/': {
          post: ['HomeController#home']
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('post', result);
    });

    it('should return array with one PUT route', () => {
      mainConfig['routes'] = {
        '/': {
          put: ['HomeController#home']
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('put', result);
    });

    it('should return array with one DELETE route', () => {
      mainConfig['routes'] = {
        '/': {
          delete: ['HomeController#home']
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('delete', result);
    });

    it('should return array with one PATCH route', () => {
      mainConfig['routes'] = {
        '/': {
          patch: ['HomeController#home']
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('patch', result);
    });
  });

  describe('from object', () => {
    it('should return array with 2 route, 2 controllers', () => {
      mainConfig['routes'] = {
        '/': {
          get: {
            controller: 'HomeController',
            action: 'home'
          },
          '/second': {
            get: [
              {
                controller: 'HomeController',
                action: 'home2'
              },
              {
                controller: 'HomeController',
                action: 'home3'
              }
            ]
          }
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/');
      expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
      expect(result[0].controllers[0].controller).to.equal('HomeController');
      expect(result[0].controllers[0].action).to.equal('home');
      expect(result[0].controllers[0].classPath).to.equal(mainConfig.controllers);

      expect(result[1]).to.an('object');
      expect(result[1].method).to.equal('get');
      expect(result[1].route).to.equal('/second');
      expect(result[1].controllers).to.be.an('array').that.have.lengthOf(2);
      expect(result[1].controllers[0].controller).to.equal('HomeController');
      expect(result[1].controllers[0].action).to.equal('home2');
      expect(result[1].controllers[0].classPath).to.equal(mainConfig.controllers);
      expect(result[1].controllers[1].controller).to.equal('HomeController');
      expect(result[1].controllers[1].action).to.equal('home3');
      expect(result[1].controllers[1].classPath).to.equal(mainConfig.controllers);
    });

    it('should return array with one GET route', () => {
      mainConfig['routes'] = {
        '/': {
          get: {
            controller: 'HomeController',
            action: 'home'
          }
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('get', result);
    });

    it('should return array with one POST route', () => {
      mainConfig['routes'] = {
        '/': {
          post: {
            controller: 'HomeController',
            action: 'home'
          }
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('post', result);
    });

    it('should return array with one PUT route', () => {
      mainConfig['routes'] = {
        '/': {
          put: {
            controller: 'HomeController',
            action: 'home'
          }
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('put', result);
    });

    it('should return array with one PATCH route', () => {
      mainConfig['routes'] = {
        '/': {
          patch: {
            controller: 'HomeController',
            action: 'home'
          }
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('patch', result);
    });

    it('should return array with one DELETE route', () => {
      mainConfig['routes'] = {
        '/': {
          delete: {
            controller: 'HomeController',
            action: 'home'
          }
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('delete', result);
    });
  });

  describe('from function', () => {
    it('should return array with 2 route, 2 controllers', () => {
      mainConfig['routes'] = {
        '/': {
          get: (req, res, next) => {next();},
          '/second': {
            get: [
              (req, res, next) => {next();},
              (req, res, next) => {next();}
            ]
          }
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/');
      expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
      expect(result[0].controllers[0].controller).to.equal('_ANON_');
      expect(result[0].controllers[0].action).to.an('function');
      expect(result[0].controllers[0].classPath).to.equal(mainConfig.controllers);

      expect(result[1]).to.an('object');
      expect(result[1].method).to.equal('get');
      expect(result[1].route).to.equal('/second');
      expect(result[1].controllers).to.be.an('array').that.have.lengthOf(2);
      expect(result[1].controllers[0].controller).to.equal('_ANON_');
      expect(result[1].controllers[0].action).to.an('function');
      expect(result[1].controllers[0].classPath).to.equal(mainConfig.controllers);
      expect(result[1].controllers[1].controller).to.equal('_ANON_');
      expect(result[1].controllers[1].action).to.an('function');
      expect(result[1].controllers[1].classPath).to.equal(mainConfig.controllers);
    });

    it('should return array with one GET route', () => {
      mainConfig['routes'] = {
        '/': {
          get: (req, res, next) => {next();}
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('get', result, true);
    });

    it('should return array with one POST route', () => {
      mainConfig['routes'] = {
        '/': {
          post: (req, res, next) => {next();}
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('post', result, true);
    });

    it('should return array with one PATCH route', () => {
      mainConfig['routes'] = {
        '/': {
          patch: (req, res, next) => {next();}
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('patch', result, true);
    });

    it('should return array with one PUT route', () => {
      mainConfig['routes'] = {
        '/': {
          put: (req, res, next) => {next();}
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('put', result, true);
    });

    it('should return array with one DELETE route', () => {
      mainConfig['routes'] = {
        '/': {
          delete: (req, res, next) => {next();}
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expectedOneRouteWith('delete', result, true);
    });
  });

  describe('with errors', () => {
    describe('when route is a number', () => {
      it('should return an array with status route malformed', () => {
        mainConfig['routes'] = {
          22: {
            get: 'HomeController#home',
          },
        };

        const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.an('object');
        expect(result[0].method).to.equal('N/A');
        expect(result[0].route).to.equal('22');
        expect(result[0].status & router.ERRORS.ROUTE.ROUTE_MALFORMED).to.equal(router.ERRORS.ROUTE.ROUTE_MALFORMED);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
      });
    });

    describe('when route does not start with /', () => {
      it('should return an array with status route malformed', () => {
        mainConfig['routes'] = {
          'route': {
            get: 'HomeController#home',
          },
        };

        const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.an('object');
        expect(result[0].method).to.equal('N/A');
        expect(result[0].route).to.equal('route');
        expect(result[0].status & router.ERRORS.ROUTE.ROUTE_MALFORMED).to.equal(router.ERRORS.ROUTE.ROUTE_MALFORMED);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
      });
    });

    describe('when route is an array', () => {
      it('should return an array with status route malformed', () => {
        mainConfig['routes'] = {
          ['route']: {
            get: 'HomeController#home',
          },
        };

        const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
        expect(result).to.have.lengthOf(1);
        expect(result[0]).to.an('object');
        expect(result[0].method).to.equal('N/A');
        expect(result[0].route).to.equal('route');
        expect(result[0].status & router.ERRORS.ROUTE.ROUTE_MALFORMED).to.equal(router.ERRORS.ROUTE.ROUTE_MALFORMED);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
      });
    });

    describe('when config of route is an array', () => {
      it('should return an exception', () => {
        mainConfig['routes'] = {
          '/': ['HomeController#home'],
        };

        expect((() => {
          routeExtract.route(mainConfig, mainConfig.routes, isDebug);
        })).to.throw('Route config malformed, it should be an object. array given');
      });
    });

    describe('when config of route is a string', () => {
      it('should return an exception', () => {
        mainConfig['routes'] = {
          '/': 'HomeController#home',
        };

        expect((() => {
          routeExtract.route(mainConfig, mainConfig.routes, isDebug);
        })).to.throw('Route config malformed, it should be an object. string given');
      });
    });

    describe('when config of route is a int', () => {
      it('should return an exception', () => {
        mainConfig['routes'] = {
          '/': 22,
        };

        expect((() => {
          routeExtract.route(mainConfig, mainConfig.routes, isDebug);
        })).to.throw('Route config malformed, it should be an object. number given');
      });
    });
  });

  describe('static', () => {
    it('should return an array with static route + 2 actions', () => {
      mainConfig['routes'] = {
        '/public': {
          '_static_': {
            'targets': ['example/public', 'example/media'],
          }
        }
      };

      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/public');
      expect(result[0].controllers).to.be.an('array').that.have.lengthOf(2);
      expect(result[0].controllers[0].controller).to.equal('_ANON_');
      expect(result[0].controllers[0].action).to.equal('example/public');
      expect(result[0].controllers[0].static).to.be.true;
      expect(result[0].controllers[0].classPath).to.equal(mainConfig.controllers);
      expect(result[0].controllers[1].controller).to.equal('_ANON_');
      expect(result[0].controllers[1].action).to.equal('example/media');
      expect(result[0].controllers[1].static).to.be.true;
      expect(result[0].controllers[1].classPath).to.equal(mainConfig.controllers);
    });
  });
});
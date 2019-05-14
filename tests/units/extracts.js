const { expect } = require('chai');
const routeExtract = require('../../src/extract/routes');

describe('Extract routes', () => {
  const isDebug = true;
  const mainConfig = {
    controllers: `${__dirname}/controllers1`,
  };

  const expectRoute = (route, expected) => {
    expect(route).to.an('object');
    expect(route.method).to.equal(expected.method);
    expect(route.route).to.equal(expected.route);
    expect(route.controller).to.equal(expected.controller);
    if(expected.action) {
      expect(route.action).to.equal(expected.action);
    }
    expect(route.classPath).to.equal(mainConfig.controllers);
  };

  describe('from string', () => {
    it('should return array with length equals to 1', () => {
      mainConfig['routes'] = {
        '/string': {
          get: 'HomeController#home',
          '/second': ['HomeController#home', 'HomeController#home2']
        },
      };
      const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
      console.log(result)
      expect(result).to.be.an('array').that.have.lengthOf(2);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/string');
      expect(result[0].controllers[0].controller).to.equal('HomeController');
      expect(result[0].controllers[0].action).to.equal('home');
      expect(result[0].controllers[0].classPath).to.equal(mainConfig.controllers);

      expect(result[1]).to.an('object');
      expect(result[1].method).to.equal('get');
      expect(result[1].route).to.equal('/second/string');
      expect(result[1].controllers[0].controller).to.equal('HomeController');
      expect(result[1].controllers[0].action).to.equal('home');
      expect(result[1].controllers[1].controller).to.equal('HomeController');
      expect(result[1].controllers[1].action).to.equal('home2');
      expect(result[1].controllers[0].classPath).to.equal(mainConfig.controllers);
    });

    // it('should return array length equals to 2', () => {
    //   mainConfig['routes'] = {
    //     '/': {
    //       'get': []
    //     },
    //   };
    //   const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
    //   expect(result).to.have.lengthOf(2);
    //   expect(result[0]).to.an('object');
    //   expect(result[0].method).to.equal('get');
    //   expect(result[0].route).to.equal('/string');
    //   expect(result[0].controllers[0].controller).to.equal('HomeController');
    //   expect(result[0].controllers[0].action).to.equal('home');
    //   expect(result[0].controllers[0].classPath).to.equal(mainConfig.controllers);
    // });
  });
  //
  // describe('from object', () => {
  //   it('should return array length equals to 1', () => {
  //     mainConfig['routes'] = {
  //       '/': {
  //         'get': {
  //           controller: 'HomeController',
  //           action: 'home'
  //         }
  //       },
  //     };
  //     const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
  //     expect(result).to.have.lengthOf(1);
  //     expectRoute(result[0], {
  //       method: 'get',
  //       route: '/',
  //       controller: 'HomeController',
  //       action: 'home'
  //     });
  //   });
  //
  //   it('should return array length equals to 2', () => {
  //     mainConfig['routes'] = {
  //       '/': {
  //         'get': [
  //           {
  //             controller: 'HomeController',
  //             action: 'home'
  //           },
  //           {
  //             controller: 'HomeController',
  //             action: 'home2'
  //           }
  //         ]
  //       },
  //     };
  //     const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
  //     expect(result).to.have.lengthOf(2);
  //     expectRoute(result[0], {
  //       method: 'get',
  //       route: '/',
  //       controller: 'HomeController',
  //       action: 'home'
  //     });
  //     expectRoute(result[1], {
  //       method: 'get',
  //       route: '/',
  //       controller: 'HomeController',
  //       action: 'home2'
  //     });
  //   });
  // });
  //
  // describe('from function', () => {
  //   it('should return array length equals to 1', () => {
  //     mainConfig['routes'] = {
  //       '/': {
  //         'get': (req, res, next) => {next();}
  //       },
  //     };
  //     const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
  //     expect(result).to.have.lengthOf(1);
  //     expectRoute(result[0], {
  //       method: 'get',
  //       route: '/',
  //       controller: '_ANON_',
  //     });
  //     expect(result[0].action).to.an('function');
  //   });
  //
  //   it('should return array length equals to 2', () => {
  //     mainConfig['routes'] = {
  //       '/': {
  //         'get': [
  //           (req, res, next) => {next();},
  //           (req, res, next) => {next();}
  //         ]
  //       },
  //     };
  //     const result = routeExtract.route(mainConfig, mainConfig.routes, isDebug);
  //     expect(result).to.have.lengthOf(2);
  //     expectRoute(result[0], {
  //       method: 'get',
  //       route: '/',
  //       controller: '_ANON_',
  //     });
  //     expectRoute(result[1], {
  //       method: 'get',
  //       route: '/',
  //       controller: '_ANON_',
  //     });
  //     expect(result[0].action).to.an('function');
  //     expect(result[1].action).to.an('function');
  //   });
  // });
});
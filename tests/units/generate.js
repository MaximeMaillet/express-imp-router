const { expect } = require('chai');
const routeGenerator = require('../../src/generator/generator')
const router = require('../../index');

describe('Generate routes', () => {
  describe('with good routes', () => {
    const routes = [
      {
        route: '/string',
        method: 'get',
        status: 0,
        controllers: [
          {
            debug: {},
            route: '/string',
            method: 'get',
            controller: 'HomeController',
            action: 'home',
            classPath: `${__dirname}/controllers/`,
            status: 0
          }
        ],
        debug: { controller: 'HomeController', action: 'home' }
      },
    ];

    it('should have "generated" to true', () => {
      const result = routeGenerator.generate(routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/string');
      expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
      expect(result[0].controllers[0].generated).to.be.true;
    });
  });

  describe('with uncorrect action', () => {
    const routes = [
      {
        route: '/string',
        method: 'get',
        status: 0,
        controllers: [
          {
            debug: {},
            route: '/string',
            method: 'get',
            controller: 'HomeController',
            action: 'home2',
            classPath: `${__dirname}/controllers/`,
            status: 0
          }
        ],
        debug: { controller: 'HomeController', action: 'home' }
      },
    ];

    it('should have "generated" to false and status different to 0', () => {
      const result = routeGenerator.generate(routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/string');
      expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
      expect(result[0].controllers[0].generated).to.be.false;
      expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.ACTION_FAILED).to.equal(router.ERRORS.CONTROLLER.ACTION_FAILED);
    });
  });

  describe('with no action', () => {
    const routes = [
      {
        route: '/string',
        method: 'get',
        status: 0,
        controllers: [
          {
            debug: {},
            route: '/string',
            method: 'get',
            controller: 'HomeController',
            // action: '',
            classPath: `${__dirname}/controllers/`,
            status: 0
          }
        ],
        debug: { controller: 'HomeController', action: 'home' }
      },
    ];

    it('should have "generated" to false and status different to 0', () => {
      const result = routeGenerator.generate(routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/string');
      expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
      expect(result[0].controllers[0].generated).to.be.false;
      expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.ACTION_FAILED).to.equal(router.ERRORS.CONTROLLER.ACTION_FAILED);
    });
  });

  describe('with uncorrect controller', () => {
    const routes = [
      {
        route: '/string',
        method: 'get',
        status: 0,
        controllers: [
          {
            debug: {},
            route: '/string',
            method: 'get',
            controller: 'InexistantController',
            // action: '',
            classPath: `${__dirname}/controllers/`,
            status: 0
          }
        ],
        debug: { controller: 'HomeController', action: 'home' }
      },
    ];

    it('should have "generated" to false and status different to 0', () => {
      const result = routeGenerator.generate(routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/string');
      expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
      expect(result[0].controllers[0].generated).to.be.false;
      expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.CONTROLLER_FAILED).to.equal(router.ERRORS.CONTROLLER.CONTROLLER_FAILED);
    });
  });

  describe('with no controller', () => {
    const routes = [
      {
        route: '/string',
        method: 'get',
        status: 0,
        controllers: [
          {
            debug: {},
            route: '/string',
            method: 'get',
            // controller: 'HomeController',
            // action: '',
            classPath: `${__dirname}/controllers/`,
            status: 0
          }
        ],
        debug: { controller: 'HomeController', action: 'home' }
      },
    ];

    it('should have "generated" to false and status different to 0', () => {
      const result = routeGenerator.generate(routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0]).to.an('object');
      expect(result[0].method).to.equal('get');
      expect(result[0].route).to.equal('/string');
      expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
      expect(result[0].controllers[0].generated).to.be.false;
      expect(result[0].controllers[0].status & router.ERRORS.CONTROLLER.CONTROLLER_FAILED).to.equal(router.ERRORS.CONTROLLER.CONTROLLER_FAILED);
    });
  });
});
const { expect } = require('chai');
const midExtract = require('../../../src/extract/middlewares');
const router = require('../../../index');

describe('Extract middlewares', () => {
  const mainConfig = {
    controllers: `${__dirname}/controllers1`,
  };

  function expectExtract(result) {
    expect(result[0].controllers[0].route).to.equal('/string');
    expect(result[0].controllers[0].controller).to.equal('withName/getName');
    expect(result[0].controllers[0].action).to.equal('getName');
    expect(result[0].controllers[0].level).to.equal(router.MIDDLEWARE.LEVEL.APP);
    expect(result[0].controllers[1].route).to.equal('/string');
    expect(result[0].controllers[1].controller).to.equal('consolelog');
    expect(result[0].controllers[1].action).to.equal('selfLog');
    expect(result[0].controllers[1].level).to.equal(router.MIDDLEWARE.LEVEL.APP);
    expect(result[0].controllers[2].route).to.equal('/string');
    expect(result[0].controllers[2].controller).to.equal('consolelog');
    expect(result[0].controllers[2].action).to.equal('log');
    expect(result[0].controllers[2].level).to.equal(router.MIDDLEWARE.LEVEL.APP);
  }

  describe('from string', () => {
    it('should return array with 1 route and 3 middlewares', () => {
      mainConfig['routes'] = {
        '/string': {
          [router.IMP.MIDDLEWARE]: {
            'controllers': ['withName/getName#getName', 'consolelog#selfLog', 'consolelog#log'],
          },
          get: 'HomeController#home',
        },
      };
      const result = midExtract.extract(mainConfig, mainConfig.routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0].controllers).to.be.an('array').that.have.lengthOf(3);
      expectExtract(result);
    });
  });

  describe('from object', () => {
    it('should return array with 1 route and 3 middlewares', () => {
      mainConfig['routes'] = {
        '/string': {
          [router.IMP.MIDDLEWARE]: {
            'controllers': [
              {
                controller: 'withName/getName',
                action: 'getName'
              },
              {
                controller: 'consolelog',
                action: 'selfLog'
              },
              {
                controller: 'consolelog',
                action: 'log'
              },
            ],
          },
          get: 'HomeController#home',
        },
      };
      const result = midExtract.extract(mainConfig, mainConfig.routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0].controllers).to.be.an('array').that.have.lengthOf(3);
      expectExtract(result);
    });
  });

  describe('from function', () => {
    it('should return array with 1 route and 3 middlewares', () => {
      mainConfig['routes'] = {
        '/string': {
          [router.IMP.MIDDLEWARE]: {
            'controllers': [
              (req, res, next) => {},
              (req, res, next) => {},
              (req, res, next) => {},
            ],
          },
          get: 'HomeController#home',
        },
      };
      const result = midExtract.extract(mainConfig, mainConfig.routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0].controllers).to.be.an('array').that.have.lengthOf(3);
      expect(result[0].controllers[0].route).to.equal('/string');
      expect(result[0].controllers[0].controller).to.equal('_ANON_');
      expect(result[0].controllers[0].action).to.be.an('function');
      expect(result[0].controllers[0].level).to.equal(router.MIDDLEWARE.LEVEL.APP);
      expect(result[0].controllers[1].route).to.equal('/string');
      expect(result[0].controllers[1].controller).to.equal('_ANON_');
      expect(result[0].controllers[1].action).to.be.an('function');
      expect(result[0].controllers[1].level).to.equal(router.MIDDLEWARE.LEVEL.APP);
      expect(result[0].controllers[2].route).to.equal('/string');
      expect(result[0].controllers[2].controller).to.equal('_ANON_');
      expect(result[0].controllers[2].action).to.be.an('function');
      expect(result[0].controllers[2].level).to.equal(router.MIDDLEWARE.LEVEL.APP);
    });
  });

  describe('with inheritance', () => {
    it('should return array with 1 route and 1 middleware with inheritance descending', () => {
      mainConfig['routes'] = {
        '/string': {
          [router.IMP.MIDDLEWARE]: {
            controllers: [
              {
                controller: 'withName/getName',
                action: 'getName',
              },
            ],
            inheritance: 'descending',
          },
          get: 'HomeController#home',
        },
      };
      const result = midExtract.extract(mainConfig, mainConfig.routes);
      expect(result).to.be.an('array').that.have.lengthOf(1);
      expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
      expect(result[0].inheritance).to.be.a('string');
      expect(result[0].inheritance).to.equal('descending');
    });
  });

  describe('with level', () => {
    describe('with default level', () => {
      it('should return array with 1 route and 1 middleware with app level', () => {
        mainConfig['routes'] = {
          '/string': {
            [router.IMP.MIDDLEWARE]: {
              controllers: ['withName/getName#getName'],
              level: router.MIDDLEWARE.LEVEL.DEFAULT,
            },
            get: 'HomeController#home',
          },
        };
        const result = midExtract.extract(mainConfig, mainConfig.routes);
        expect(result).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].level).to.be.a('string');
        expect(result[0].level).to.equal(router.MIDDLEWARE.LEVEL.APP);
      });
    });

    describe('with level app', () => {
      it('should return array with 1 route and 1 middleware with app level', () => {
        mainConfig['routes'] = {
          '/string': {
            [router.IMP.MIDDLEWARE]: {
              controllers: ['withName/getName#getName'],
              level: router.MIDDLEWARE.LEVEL.APP,
            },
            get: 'HomeController#home',
          },
        };
        const result = midExtract.extract(mainConfig, mainConfig.routes);
        expect(result).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].level).to.be.a('string');
        expect(result[0].level).to.equal(router.MIDDLEWARE.LEVEL.APP);
      });
    });

    describe('with level global', () => {
      it('should return array with 1 route and 1 middleware with global level', () => {
        mainConfig['routes'] = {
          '/string': {
            [router.IMP.MIDDLEWARE]: {
              controllers: ['withName/getName#getName'],
              level: router.MIDDLEWARE.LEVEL.GLOBAL,
            },
            get: 'HomeController#home',
          },
        };
        const result = midExtract.extract(mainConfig, mainConfig.routes);
        expect(result).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].level).to.be.a('string');
        expect(result[0].level).to.equal(router.MIDDLEWARE.LEVEL.GLOBAL);
      });
    });

    describe('with level error', () => {
      it('should return array with 1 route and 1 middleware with error level', () => {
        mainConfig['routes'] = {
          '/string': {
            [router.IMP.MIDDLEWARE]: {
              controllers: ['withName/getName#getName'],
              level: router.MIDDLEWARE.LEVEL.ERROR,
            },
            get: 'HomeController#home',
          },
        };
        const result = midExtract.extract(mainConfig, mainConfig.routes);
        expect(result).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].level).to.be.a('string');
        expect(result[0].level).to.equal(router.MIDDLEWARE.LEVEL.ERROR);
      });
    });

    describe('with level notFound', () => {
      it('should return array with 1 route and 1 middleware with notFound level', () => {
        mainConfig['routes'] = {
          '/string': {
            [router.IMP.MIDDLEWARE]: {
              controllers: ['withName/getName#getName'],
              level: router.MIDDLEWARE.LEVEL.NOT_FOUND,
            },
            get: 'HomeController#home',
          },
        };
        const result = midExtract.extract(mainConfig, mainConfig.routes);
        expect(result).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].level).to.be.a('string');
        expect(result[0].level).to.equal(router.MIDDLEWARE.LEVEL.NOT_FOUND);
      });
    });
  });

  describe('with method', () => {
    describe('with ALL method', () => {
      it('should return array with 1 route and 1 middleware with method ALL', () => {
        mainConfig['routes'] = {
          '/string': {
            [router.IMP.MIDDLEWARE]: {
              controllers: ['withName/getName#getName'],
              method: router.METHOD.ALL,
            },
            get: 'HomeController#home',
          },
        };
        const result = midExtract.extract(mainConfig, mainConfig.routes);
        expect(result).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].method).to.be.a('string');
        expect(result[0].method).to.equal(router.METHOD.ALL);
      });
    });

    describe('with GET method', () => {
      it('should return array with 1 route and 1 middleware with method GET', () => {
        mainConfig['routes'] = {
          '/string': {
            [router.IMP.MIDDLEWARE]: {
              controllers: ['withName/getName#getName'],
              method: router.METHOD.GET,
            },
            get: 'HomeController#home',
          },
        };
        const result = midExtract.extract(mainConfig, mainConfig.routes);
        expect(result).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].controllers).to.be.an('array').that.have.lengthOf(1);
        expect(result[0].method).to.be.a('string');
        expect(result[0].method).to.equal(router.METHOD.GET);
      });
    });
  });
});

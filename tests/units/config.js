const { expect, assert } = require('chai');
const express = require('express');
const controllersPath = `${__dirname}/../data/controllers/`;
let app = null;
let router = null;

describe('Check express app providing', () => {
  before(() => {
    app = express();
  });

  after(() => {
    app = null;
  });

  beforeEach(() => {
    router = require('../../index');
  });

  afterEach(() => {
    router = null;
  });

  describe('with good object', () => {
    describe('in router function', () => {
      it('should dont return error', () => {
        assert.doesNotThrow(() => router(app), Error);
      });
    });

    describe('in route function', () => {
      it('should dont return an error', () => {
        router(app);
        const goodConfig = [
          {
            controllers: controllersPath,
            routes: {},
          }
        ];
        assert.doesNotThrow(() => router.route(goodConfig), Error);
      });
    });
  });

  describe('with null object', () => {
    describe('in router function', () => {
      it('should return an error', () => {
        assert.throws(router, Error, 'You should provide app from express');
      });
    });

    describe('in route function', () => {
      it('should return an error', () => {
        assert.throws(router.route, Error, 'You should provide app from express');
      });
    });
  });
});

describe('Check route config', () => {
  beforeEach(() => {
    app = express();
    router = require('../../index');
    router(app);
  });

  afterEach(() => {
    app = null;
    router = null;
  });

  describe('with empty values', () => {
    it('should throw error', () => {
      assert.throws(router.route, Error, 'Config must be an array');
    });

    it('should throw error', () => {
      assert.throws(() => router.route([]), Error, 'Config array is empty');
    });

    it('should throw error', () => {
      const config = [
        'test',
      ];
      assert.throws(() => router.route(config), Error, 'Config are not defined, please referrer to documentation');
    });

    it('should throw error', () => {
      const config = [
        1,2,
      ];
      assert.throws(() => router.route(config), Error, 'Config are not defined, please referrer to documentation');
    });

    it('should throw error', () => {
      const config = [
        {},
      ];
      assert.throws(() => router.route(config), Error, 'Controller path is not defined, please referrer to documentation');
    });

    it('should throw error', () => {
      const config = [
        {
          controllers: controllersPath
        },
      ];
      assert.throws(() => router.route(config), Error, 'Routes JSON file is not defined, please referrer to documentation');
    });

    it('should throw error', () => {
      const config = [
        {
          controllers: controllersPath,
          routes: 1,
        },
      ];
      assert.throws(() => router.route(config), Error, 'Routes JSON is invalid. It should be a path (String) or JSON object (Object)');
    });
  })
});
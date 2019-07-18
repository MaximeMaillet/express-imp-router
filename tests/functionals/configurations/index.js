const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const path = require('path');

const { expect } = chai;
chai.use(chaiHttp);

let app, router, server, config, port = null;

console.log(`${path.resolve('.')}/tests/functionals/data/controllers`);

describe('Launch Server', () => {
  describe('With bad configuration', () => {
    beforeEach(() => {
      port = 6061;
      app = express();
      router = require('../../../index');
      router(app);
    });

    afterEach(() => {
      app = null;
      router = null;
      if(server) {
        server.close();
        server = null;
      }
    });

    it('Should throw error', () => {
      config = [{
        controllers: `${path.resolve('.')}/tests/functionals/data/controllers`,
        middlewares: `${path.resolve('.')}/tests/functionals/data/middlewares`,
        routes: [{
          '/': {
            get: 'HomeController#home'
          }
        }],
      }];

      expect(() => {
        router.route(config)
      }).to.throw('Routes JSON is invalid. It should be a path (String) or JSON object (Object)')
    });

  })
});
'use strict';
const express = require('express');
const assert = require('assert');
const chai = require('chai'),
  should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const router = require('../index');

const routes = {
  '/': {
    'get': 'workflow#get'
  },
  '/err': {
    '/fail': {
      'get': 'workflow#fail'
    },
    '/error': {
      'get': 'workflow#error'
    }
  },
  '/admin': {
    'get': 'workflow#notAuthorized'
  }
};

describe('Launch router & get endpoint', () => {

  const config = {
    url: '127.0.0.1',
    port: 6666,
  };

  const app = express();
  let server = null;

  before((done) => {
    router(app);
    router.route([
      {
        routes: routes,
        controllers: `${__dirname}/fixtures/controllers`,
      }
    ]);
    server = app.listen(config.port, () => {
      done();
    });
  });

  after(() => {
    server.close();
  });


  it('Should return 200', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/')
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Should return 404', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/not_exists')
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('Should return 500', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/err/fail')
      .send()
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it('Should return 500', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/err/error')
      .send()
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it('Should return 401', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/admin')
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe('Launch router with errors handler & get endpoint', () => {

  const config = {
    url: '127.0.0.1',
    port: 6666,
  };

  const app = express();
  let server = null;

  before((done) => {
    router(app);
    router.route([
      {
        routes: Object.assign(routes, {
          '_errors': {
            '404': 'workflow#notFoundError',
            '50*': 'workflow#internalError'
          }
        }),
        controllers: `${__dirname}/fixtures/controllers`,
      }
    ]);
    server = app.listen(config.port, () => {
      done();
    });
  });

  after((done) => {
    server.close();
    done();
  });


  it('Should return 200', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/')
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Not found but should return 200', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/not_exists')
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Properly fail but should return 200', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/err/fail')
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('Throw error but should return 200', (done) => {
    chai.request(`${config.url}:${config.port}`)
      .get('/err/error')
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
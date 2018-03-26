/* eslint-disable prefer-destructuring */
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const path = require('path');
const utils = require('../index');
const port = 6060;

const config = [{
  routes: {
    '/string': {
      get: 'RoutesController#string'
    },
    '/object': {
      get: {
        controller: 'RoutesController',
        action: 'object'
      }
    },
    '/function': {
      get: (req, res) => {
        res.send({message: 'OK'});
      }
    },
    '/first': {
      '/secondWithString': {
        get: 'RoutesController#secondString'
      },
      '/secondWithObject': {
        get: {
          controller: 'RoutesController',
          action: 'secondObject'
        }
      },
      '/secondWithFunction': {
        get: {
          action: async(req, res) => {
            res.status(204).send();
          },
        }
      }
    }
  },
  controllers: `${path.resolve('.')}/tests/routes`
}];
let app = null;
let server = null;

describe('Generate routes', () => {

  before((done) => {
    utils.startServer(port, config)
      .then((data) => {
        app = data.app;
        server = data.server;
        done();
      });
  });

  after((done) => {
    if(server) {
      server.close();
    }
    done();
  });

  it('With string in one line should return OK', (done) => {
    chai
      .request(app)
      .get('/string')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      })
    ;
  });

  it('With object should return OK', (done) => {
    chai
      .request(app)
      .get('/object')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      })
    ;
  });

  it('With function should return OK', (done) => {
    chai
      .request(app)
      .get('/function')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      })
    ;
  });

  it('With second and string should return OK', (done) => {
    chai
      .request(app)
      .get('/first/secondWithString')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        done();
      })
    ;
  });

  it('With second and object should return OK', (done) => {
    chai
      .request(app)
      .get('/first/secondWithObject')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        done();
      })
    ;
  });

  it('With second and function should return OK', (done) => {
    chai
      .request(app)
      .get('/first/secondWithFunction')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204);
        done();
      })
    ;
  });
});
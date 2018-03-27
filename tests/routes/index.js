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
    '_static': {
      '/public': {
        target: `${path.resolve('.')}/tests/routes/public`,
        options: {}
      },
      '/static': {
        target: `${path.resolve('.')}/tests/routes/static`,
        options: {}
      }
    },
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
      '/withObject': {
        get: {
          action: (req, res) => {
            res.send({message: 'OK'});
          }
        }
      },
      '/withFunction': {
        get: (req, res) => {
          res.send({message: 'OK'});
        }
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
        '/withObject': {
          get: {
            action: async (req, res) => {
              res.status(204).send();
            },
          }
        },
        '/withFunction': {
          get: (req, res) => {
            res.status(204).send();
          }
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

  describe('With string', () => {
    it('at first segment should return OK', (done) => {
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

    it('at second segment should return OK', (done) => {
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
  });

  describe('With object', () => {
    it('at first segment should return OK', (done) => {
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

    it('at second segment should return OK', (done) => {
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
  });

  describe('With function', () => {
    it('at first (+object) should return OK', (done) => {
      chai
        .request(app)
        .get('/function/withObject')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });

    it('at first should return OK', (done) => {
      chai
        .request(app)
        .get('/function/withFunction')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });

    it('at second (+object) should return OK', (done) => {
      chai
        .request(app)
        .get('/first/secondWithFunction/withObject')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(204);
          done();
        })
      ;
    });

    it('at second should return OK', (done) => {
      chai
        .request(app)
        .get('/first/secondWithFunction/withFunction')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(204);
          done();
        })
      ;
    });
  });

  describe('With statics', () => {
    it('to nothing should return Not Found', (done) => {
      chai
        .request(app)
        .get('/public')
        .end((err, res) => {
          expect(err).to.be.not.null;
          expect(res).to.have.status(404);
          done();
        })
      ;
    });

    it('to html target should return OK and html', (done) => {
      chai
        .request(app)
        .get('/public/test.html')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.headers).to.have.property('content-length');
          expect(res.headers['content-length']).to.equal('63');
          expect(res.headers).to.have.property('content-type');
          expect(res.headers['content-type']).to.equal('text/html; charset=UTF-8');
          done();
        })
      ;
    });

    it('to css target should return OK and css', (done) => {
      chai
        .request(app)
        .get('/public/style.css')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.headers).to.have.property('content-length');
          expect(res.headers['content-length']).to.equal('26');
          expect(res.headers).to.have.property('content-type');
          expect(res.headers['content-type']).to.equal('text/css; charset=UTF-8');
          done();
        })
      ;
    });
  });
});
/* eslint-disable prefer-destructuring */
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const path = require('path');

const utils = require('../index');
const port = 6060;

const config = [{
  routes: `${path.resolve('.')}/tests/simple/routes.json`,
  controllers: `${path.resolve('.')}/tests/simple`
}];
let app = null;
let server = null;

describe('Generating routes', () => {

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

  beforeEach((done) => {
    done();
  });

  it('From json object should have length of 1', (done) => {
    chai
      .request(app)
      .get('/simple')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      })
    ;
  });

  it('From json object should have length of 3', (done) => {
    chai
    .request(app)
    .get('/complexe')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      done();
    })
    ;
  });
});
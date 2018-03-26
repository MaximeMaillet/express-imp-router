const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const path = require('path');

const utils = require('../index');
const port = 6061;

const config = [{
  routes: `${path.resolve('.')}/tests/middlewares/routes.json`,
  controllers: `${path.resolve('.')}/tests/middlewares/controllers`,
  middlewares: `${path.resolve('.')}/tests/middlewares/middlewares`,
}];
let app = null;
let server = null;

describe('Generate middlewares', () => {

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

  describe('For all target', () => {
    it('Should return 2 pow of 1', (done) => {
      chai
      .request(app)
      .get('/middleware/1')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.equal(2);
        done();
      })
      ;
    });

    it('Should return 2 pow of 2', (done) => {
      chai
      .request(app)
      .get('/middleware/2')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.equal(4);
        done();
      })
      ;
    });

    it('Should return 2 pow of 3', (done) => {
      chai
      .request(app)
      .get('/other/3')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.equal(8);
        done();
      })
      ;
    });

    it('Should return 2 pow of 2', (done) => {
      chai
      .request(app)
      .get('/other/2')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('result');
        expect(res.body.result).to.equal(4);
        done();
      })
      ;
    });
  });

  describe('For one target', () => {
    it('Should return status 401', (done) => {
      chai
      .request(app)
      .post('/sessions')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      })
      ;
    });

    it('Should return status 200', (done) => {
      chai
      .request(app)
      .post('/sessions')
      .send({
        auth: 'Max',
        password: 'Max'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      })
      ;
    });
  });

  describe('Include in started route', () => {
    it('Should return status 200 with result = 2', (done) => {
      chai
        .request(app)
        .get('/started/2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.equal(2);
          done();
        })
      ;
    });

    it('Should return status 200 with result = 4', (done) => {
      chai
        .request(app)
        .get('/started/4')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.equal(4);
          done();
        })
      ;
    });
  });

  describe('Include in target route', () => {
    it('Should return status 200 with result = 2', (done) => {
      chai
        .request(app)
        .get('/target/2')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.equal(2);
          done();
        })
      ;
    });

    it('Should return status 200 with result = 4', (done) => {
      chai
        .request(app)
        .get('/target/4')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.equal(4);
          done();
        })
      ;
    });
  });
});
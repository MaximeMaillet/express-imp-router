const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const path = require('path');
const router = require('../../index');

const { expect } = chai;
chai.use(chaiHttp);

let app, server, config, port = null;

describe('Static routes', () => {

  describe('with simple configuration', () => {
    before((done) => {
      port = 6061;
      app = express();
      router.purge();
      router(app);
      config = [{
        controllers: `${path.resolve('.')}/tests/functionals/data/controllers`,
        middlewares: `${path.resolve('.')}/tests/functionals/data/middlewares`,
        routes: {
          '/': {
            [router.IMP.STATIC]: {
              targets: [
                'tests/functionals/data/static/root',
              ]
            },
          },
          '/assets': {
            [router.IMP.STATIC]: {
              targets: [
                'tests/functionals/data/static/assets',
              ]
            },
          }
        },
      }];
      router.route(config);
      server = app.listen(port, () => {
        done();
      });
    });

    after(() => {
      app = null;
      if(server) {
        server.close();
        server = null;
      }
    });

    it('Should return 200 with html as content', (done) => {
      chai
        .request(app)
        .get('/index.html')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.header['content-type']).to.equal('text/html; charset=UTF-8');
          expect(res.text).to.equal('<html>\n\t<h1>Hello World !</h1>\n</html>');
          done();
        });
    });

    it('Should return 200 with image PNG as content', (done) => {
      chai
        .request(app)
        .get('/assets/githubLogo.png')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.header['content-type']).to.equal('image/png');
          expect(res.header['content-length']).to.equal('2957');
          done();
        });
    });
  });

  describe('with multiple targets', () => {
    before((done) => {
      port = 6061;
      app = express();
      router.purge();
      router(app);
      config = [{
        controllers: `${path.resolve('.')}/tests/functionals/data/controllers`,
        middlewares: `${path.resolve('.')}/tests/functionals/data/middlewares`,
        routes: {
          '/': {
            [router.IMP.STATIC]: {
              targets: [
                'tests/functionals/data/static/root',
                'tests/functionals/data/static/assets',
              ]
            },
          }
        }
      }];
      router.route(config);
      server = app.listen(port, () => {
        done();
      });
    });

    after(() => {
      app = null;
      if(server) {
        server.close();
        server = null;
      }
    });

    it('Should return 200 with html as content', (done) => {
      chai
        .request(app)
        .get('/index.html')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.header['content-type']).to.equal('text/html; charset=UTF-8');
          expect(res.text).to.equal('<html>\n\t<h1>Hello World !</h1>\n</html>');
          done();
        });
    });

    it('Should return 200 with image PNG as content', (done) => {
      chai
        .request(app)
        .get('/githubLogo.png')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.header['content-type']).to.equal('image/png');
          expect(res.header['content-length']).to.equal('2957');
          done();
        });
    });
  });
});

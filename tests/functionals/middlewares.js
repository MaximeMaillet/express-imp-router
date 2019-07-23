const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const path = require('path');
const router = require('../../index');

const { expect } = chai;
chai.use(chaiHttp);

let app, server, config, port = null;

describe('Attach middlewares', () => {

  describe('And precise inheritance', () => {
    before((done) => {
      port = 6061;
      app = express();
      router.purge();
      router(app);
      config = [{
        controllers: `${path.resolve('.')}/tests/functionals/data/controllers`,
        middlewares: `${path.resolve('.')}/tests/functionals/data/middlewares`,
        routes: {
          '/default': {
            '/app': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#default'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.DEFAULT,
                  level: router.MIDDLEWARE.LEVEL.APP,
                }
              ],
              get: 'HomeController#defaultInheritance',
              '/check': {
                get: 'HomeController#check',
              }
            },
            '/error': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#catchError'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.DEFAULT,
                  level: router.MIDDLEWARE.LEVEL.ERROR,
                }
              ],
              get: 'HomeController#throwError',
              '/check': {
                get: 'HomeController#throwError',
              }
            },
            '/notfound': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#notFound'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.DEFAULT,
                  level: router.MIDDLEWARE.LEVEL.NOT_FOUND,
                }
              ],
              get: 'HomeController#notFound',
              '/check': {
                get: 'HomeController#check',
              }
            }
          },
          '/none': {
            '/app': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#none'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.NONE,
                }
              ],
              get: 'HomeController#noneInheritance',
              '/check': {
                get: 'HomeController#check',
              }
            },
            '/error': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#catchError'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.NONE,
                  level: router.MIDDLEWARE.LEVEL.ERROR,
                }
              ],
              get: 'HomeController#throwError',
              '/check': {
                get: 'HomeController#throwError',
              }
            },
            '/notfound': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#notFound'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.NONE,
                  level: router.MIDDLEWARE.LEVEL.NOT_FOUND,
                }
              ],
              get: 'HomeController#notFound',
              '/check': {
                get: 'HomeController#check',
              }
            }
          },
          '/desc': {
            '/app': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#desc'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
                }
              ],
              get: 'HomeController#descInheritance',
              '/check': {
                get: 'HomeController#check',
              }
            },
            '/error': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#catchError'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
                  level: router.MIDDLEWARE.LEVEL.ERROR,
                }
              ],
              get: 'HomeController#throwError',
              '/check': {
                get: 'HomeController#throwError',
              }
            },
            '/notfound': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#notFound'],
                  inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
                  level: router.MIDDLEWARE.LEVEL.NOT_FOUND,
                }
              ],
              get: 'HomeController#notFound',
              '/check': {
                get: 'HomeController#check',
              }
            }
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

    it('Should return 200 with Default as "result"', (done) => {
      chai
        .request(app)
        .get('/default/app')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('Default');
          done();
        });
    });
    it('Should return 200 with null as "result"', (done) => {
      chai
        .request(app)
        .get('/default/app/check')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('null');
          done();
        });
    });
    it('Should return 422 with custom message as "message"', (done) => {
      chai
        .request(app)
        .get('/default/error')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Fail');
          done();
        });
    });
    it('Should return 500 with generic message as "message"', (done) => {
      chai
        .request(app)
        .get('/default/error/check')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('An error is happened');
          done();
        });
    });
    it('Should return 404 with custom message as "message"', (done) => {
      chai
        .request(app)
        .get('/default/notfound')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('not_found');
          done();
        });
    });
    it('Should return 404 with generic message as "message"', (done) => {
      chai
        .request(app)
        .get('/default/notfound/checkNotfound')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Not found : GET /default/notfound/checkNotfound does not exists');
          done();
        });
    });

    it('Should return 200 with None as "result"', (done) => {
      chai
        .request(app)
        .get('/none/app')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('None');
          done();
        });
    });
    it('Should return 200 with null as "result"', (done) => {
      chai
        .request(app)
        .get('/none/app/check')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('null');
          done();
        });
    });
    it('Should return 422 with error as "message"', (done) => {
      chai
        .request(app)
        .get('/none/error')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Fail');
          done();
        });
    });
    it('Should return 500 with generic message as "message"', (done) => {
      chai
        .request(app)
        .get('/none/error/check')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          expect(res.body.message).to.equal('An error is happened');
          done();
        });
    });
    it('Should return 404 with custom message as "message"', (done) => {
      chai
        .request(app)
        .get('/none/notfound')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('not_found');
          done();
        });
    });
    it('Should return 404 with generic message as "message"', (done) => {
      chai
        .request(app)
        .get('/none/notfound/checkNotfound')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Not found : GET /none/notfound/checkNotfound does not exists');
          done();
        });
    });

    it('Should return 200 with Desc as "result"', (done) => {
      chai
        .request(app)
        .get('/desc/app')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('Desc');
          done();
        });
    });
    it('Should return 200 with Desc as "result"', (done) => {
      chai
        .request(app)
        .get('/desc/app/check')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('Desc');
          done();
        });
    });
    it('Should return 422 with custom message as "message"', (done) => {
      chai
        .request(app)
        .get('/desc/error')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Fail');
          done();
        });
    });
    it('Should return 422 with custom message as "message"', (done) => {
      chai
        .request(app)
        .get('/desc/error/check')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(422);
          expect(res.body.message).to.equal('Fail');
          done();
        });
    });
    it('Should return 404 with custom message as "message"', (done) => {
      chai
        .request(app)
        .get('/desc/notfound')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('not_found');
          done();
        });
    });
    it('Should return 404 with custom message as "message"', (done) => {
      chai
        .request(app)
        .get('/desc/notfound/checkNotfound')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('not_found');
          done();
        });
    });
  });

  describe('And precise method', () => {
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
            [router.IMP.MIDDLEWARE]: [
              {
                controllers: ['mMethods#get'],
                method: router.METHOD.GET,
              },
              {
                controllers: ['mMethods#post'],
                method: router.METHOD.POST,
              },
              {
                controllers: ['mMethods#put'],
                method: router.METHOD.PUT,
              },
              {
                controllers: ['mMethods#patch'],
                method: router.METHOD.PATCH,
              },
              {
                controllers: ['mMethods#delete'],
                method: router.METHOD.DELETE,
              },
              {
                controllers: ['mMethods#options'],
                method: router.METHOD.OPTIONS,
              },
              {
                controllers: ['mMethods#trace'],
                method: router.METHOD.TRACE,
              }
            ],
            get: 'HomeController#showMethod',
            post: 'HomeController#showMethod',
            put: 'HomeController#showMethod',
            patch: 'HomeController#showMethod',
            delete: 'HomeController#showMethod',
            options: 'HomeController#showMethod',
            trace: 'HomeController#showMethod',
          },
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

    it('Should return GET', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('GET');
          done();
        });
    });
    it('Should return POST', (done) => {
      chai
        .request(app)
        .post('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('POST');
          done();
        });
    });
    it('Should return PUT', (done) => {
      chai
        .request(app)
        .put('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('PUT');
          done();
        });
    });
    it('Should return PATCH', (done) => {
      chai
        .request(app)
        .patch('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('PATCH');
          done();
        });
    });
    it('Should return DELETE', (done) => {
      chai
        .request(app)
        .delete('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('DELETE');
          done();
        });
    });
    it('Should return OPTIONS', (done) => {
      chai
        .request(app)
        .options('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('OPTIONS');
          done();
        });
    });
    it('Should return TRACE', (done) => {
      chai
        .request(app)
        .trace('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('TRACE');
          done();
        });
    });
  });

  describe('With global middlewares', () => {
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
            [router.IMP.MIDDLEWARE]: [
              {
                controllers: ['mMethods#get'],
                level: router.MIDDLEWARE.LEVEL.GLOBAL,
              },
            ],
            get: 'HomeController#showMethod',
            '/other': {
              get: 'HomeController#showMethod',
              '/other': {
                get: 'HomeController#showMethod',
              }
            }
          },
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

    it('Should return GET', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('GET');
          done();
        });
    });

    it('Should return GET', (done) => {
      chai
        .request(app)
        .get('/other')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('GET');
          done();
        });
    });

    it('Should return GET', (done) => {
      chai
        .request(app)
        .get('/other/other')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('GET');
          done();
        });
    });
  });

  describe('With app middlewares', () => {
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
            [router.IMP.MIDDLEWARE]: [
              {
                controllers: ['mMethods#get'],
                level: router.MIDDLEWARE.LEVEL.APP,
              },
            ],
            get: 'HomeController#showMethod',
            '/other': {
              get: 'HomeController#showMethod',
              '/other': {
                get: 'HomeController#showMethod',
              }
            }
          },
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

    it('Should return GET', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.result).to.equal('GET');
          done();
        });
    });

    it('Should not return GET', (done) => {
      chai
        .request(app)
        .get('/other')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });

    it('Should not return GET', (done) => {
      chai
        .request(app)
        .get('/other/other')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('With middleware for parent and for children', () => {
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
            [router.IMP.MIDDLEWARE]: [
              {
                controllers: ['mInheritance#parent'],
                inheritance: router.MIDDLEWARE.INHERITANCE.DESC
              },
            ],
            get: 'HomeController#showMessage',
            '/desc': {
              get: 'HomeController#showMessage',
            },
            '/child': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mInheritance#children'],
                },
              ],
              get: 'HomeController#showMessage',
            }
          },
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

    it('Should return 200 with parent as "message"', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('parent');
          done();
        });
    });

    it('Should return 200 with parent as "message"', (done) => {
      chai
        .request(app)
        .get('/desc')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('parent');
          done();
        });
    });

    it('Should return 200 with children as "message"', (done) => {
      chai
        .request(app)
        .get('/child')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('children');
          done();
        });
    });
  });

  describe('With natural priority', () => {
    before((done) => {
      port = 6061;
      app = express();
      router.purge();
      router(app);
      config = [{
        controllers: `${path.resolve('.')}/tests/functionals/data/controllers`,
        middlewares: `${path.resolve('.')}/tests/functionals/data/middlewares`,
        routes: {
          '/hello': {
            [router.IMP.MIDDLEWARE]: [
              {
                controllers: ['mMessage#hello'],
                inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
              },
            ],
            get: 'HomeController#showMessage',
            '/sir': {
              get: 'HomeController#showMessage',
            },
            '/world': {
              [router.IMP.MIDDLEWARE]: [
                {
                  controllers: ['mMessage#world'],
                },
              ],
              get: 'HomeController#showMessage',
              '/hi': {
                [router.IMP.MIDDLEWARE]: [
                  {
                    controllers: ['mMessage#hi'],
                  },
                ],
                get: 'HomeController#showMessage',
              }
            },
          },
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

    it('Should return 200 with hello as "message"', (done) => {
      chai
        .request(app)
        .get('/hello')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('hello');
          done();
        });
    });

    it('Should return 200 with hello as "message"', (done) => {
      chai
        .request(app)
        .get('/hello/sir')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('hello');
          done();
        });
    });

    it('Should return 200 with world as "message"', (done) => {
      chai
        .request(app)
        .get('/hello/world')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('world');
          done();
        });
    });

    it('Should return 200 with hi as "message"', (done) => {
      chai
        .request(app)
        .get('/hello/world/hi')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('hi');
          done();
        });
    });
  });

  describe('With defined priority', () => {
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
            [router.IMP.MIDDLEWARE]: [
              {
                controllers: ['mMessage#hello'],
                method: router.METHOD.GET,
                priority: 0,
              },
              {
                controllers: ['mMessage#world'],
                method: router.METHOD.POST,
                priority: 0,
              },
              {
                controllers: ['mMessage#thank'],
                method: router.METHOD.ALL,
                priority: 1,
              },
              {
                controllers: ['mMessage#hi'],
                method: router.METHOD.ALL,
                priority: 2,
              },
            ],
            get: 'HomeController#showMessage',
            post: 'HomeController#showMessage',
            put: 'HomeController#showMessage',
          },
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

    it('Should return 200 with hello as "message"', (done) => {
      chai
        .request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('hello');
          done();
        });
    });

    it('Should return 200 with world as "message"', (done) => {
      chai
        .request(app)
        .post('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('world');
          done();
        });
    });

    it('Should return 200 with hi as "message"', (done) => {
      chai
        .request(app)
        .put('/')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('thank');
          done();
        });
    });
  });
});

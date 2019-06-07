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
            action: async(req, res) => {
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
    },
    '/method': {
      '/all': {
        all: (req, res) => {
          res.send({});
        }
      },
      '/get': {
        get: (req, res) => {
          res.send({});
        }
      },
      '/post': {
        post: (req, res) => {
          res.send({});
        }
      },
      '/patch': {
        patch: (req, res) => {
          res.send({});
        }
      },
      '/put': {
        put: (req, res) => {
          res.send({});
        }
      },
      '/delete': {
        delete: (req, res) => {
          res.send({});
        }
      },
      '/options': {
        options: (req, res) => {
          res.send({});
        }
      },
      '/head': {
        head: (req, res) => {
          res.send({});
        }
      },
      '/connect': {
        connect: (req, res) => {
          res.send({});
        }
      },
      '/trace': {
        trace: (req, res) => {
          res.send({});
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

  describe('With different method', () => {

    it('with get return OK', (done) => {
      chai
        .request(app)
        .get('/method/get')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });

    it('with post return OK', (done) => {
      chai
        .request(app)
        .post('/method/post')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });

    it('with patch return OK', (done) => {
      chai
        .request(app)
        .patch('/method/patch')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });

    it('with put return OK', (done) => {
      chai
        .request(app)
        .put('/method/put')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });

    it('with delete return OK', (done) => {
      chai
        .request(app)
        .delete('/method/delete')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });

    it('with head return OK', (done) => {
      chai
        .request(app)
        .head('/method/head')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });
    // @todo
    // it('with connect return OK', (done) => {
    //   chai
    //     .request(app)
    //     .connect('/method/connect')
    //     .end((err, res) => {
    //       expect(err).to.be.null;
    //       expect(res).to.have.status(200);
    //       done();
    //     })
    //   ;
    // });

    it('with options return OK', (done) => {
      chai
        .request(app)
        .options('/method/options')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });

    it('with trace return OK', (done) => {
      chai
        .request(app)
        .trace('/method/trace')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
      ;
    });
  });
});
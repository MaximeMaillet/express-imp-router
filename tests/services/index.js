/* eslint-disable prefer-destructuring */
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const path = require('path');
const utils = require('../index');
const port = 6062;

const config = [{
  routes: {
    '_services': [
      {
        target: ['/circle/sin/:x', '/circle/cos/:x'],
        action: ['circle']
      },
      {
        target: new RegExp('^\/users\/*'),
        action: ['user']
      }
    ],
    '/math': {
      '_services': ['math'],
      '/add/:x/:y': {
        get: 'MainController#add'
      },
      '/divide/:x/:y': {
        get: 'MainController#divide'
      },
      '/multiply/:x/:y': {
        get: 'MainController#multiply'
      },
    },
    '/circle': {
      '/sin/:x': {
        get: 'MainController#sin'
      },
      '/cos/:x': {
        get: 'MainController#cos'
      }
    },
    '/users': {
      get: 'MainController#getAllUsers',
      '/:id': {
        get: 'MainController#getOneUser'
      }
    }
  },
  controllers: `${path.resolve('.')}/tests/services`,
  services: [
    {
      name: 'math',
      service: require('./services/MathService'),
    },
    {
      name: 'circle',
      service: require('./services/CircleService'),
    },
    {
      name: 'user',
      service: require('./services/UserService'),
    }
  ]
}];
let app = null;
let server = null;

describe('Generate services', () => {

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

  describe('Declare service in global', () => {
    it('for cos 0 should return 1', (done) => {
      chai
        .request(app)
        .get('/circle/cos/0')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.equal(1);
          done();
        })
      ;
    });

    it('for sin 0 should return 0', (done) => {
      chai
        .request(app)
        .get('/circle/sin/0')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.equal(0);
          done();
        })
      ;
    });
  });

  describe('Declare service in sub-route', () => {
    it('for add should return 5', (done) => {
      chai
        .request(app)
        .get('/math/add/2/3')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.equal(5);
          done();
        })
      ;
    });

    it('for divide should return 2', (done) => {
      chai
        .request(app)
        .get('/math/divide/6/3')
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

    it('for multiply should return 15', (done) => {
      chai
        .request(app)
        .get('/math/multiply/5/3')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.equal(15);
          done();
        })
      ;
    });
  });

  describe('Declare global service with RegExp', () => {
    it('for get one user, should return one user', (done) => {
      chai
        .request(app)
        .get('/users/1')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal(1);
          done();
        })
      ;
    });

    it('for get all users, should return array', (done) => {
      chai
        .request(app)
        .get('/users')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        })
      ;
    });
  });
});
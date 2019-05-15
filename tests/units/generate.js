const { expect } = require('chai');
const routeGenerator = require('../../src/generator/generator')
const router = require('../../index');

describe('Generate routes', () => {
  const routes = [
    {
      route: '/string',
      method: 'get',
      status: 0,
      controllers: [
        {
          debug: {},
          route: '/string',
          method: 'get',
          controller: 'HomeController',
          action: 'home',
          classPath: `${__dirname}/controllers/`,
          status: 0
        }
      ],
      debug: { controller: 'HomeController', action: 'home' }
    },
    {
      route: '/string/second',
      method: 'get',
      status: 0,
      controllers: [
        {
          debug: {},
          route: '/string',
          method: 'get',
          controller: 'HomeController',
          action: 'home',
          classPath: `${__dirname}/controllers/`,
          status: 0
        }
      ],
      debug: {
        controller: 'HomeController',
        action: 'home',
        multiple: true
      }
    }
  ];
  
  it('should have "generated" to true', () => {
    const result = routeGenerator.generate(routes);
    expect(result).to.be.an('array').that.have.lengthOf(2);
    expect(result[0]).to.an('object');
    expect(result[0].method).to.equal('get');
    expect(result[0].route).to.equal('/string');
    expect(result[0].controllers).to.an('array').that.have.lengthOf(1);
    expect(result[0].controllers[0].generated).to.be.true;

    expect(result[1]).to.an('object');
    expect(result[1].method).to.equal('get');
    expect(result[1].route).to.equal('/string/second');
    expect(result[1].controllers).to.an('array').that.have.lengthOf(1);
    expect(result[1].controllers[0].generated).to.be.true;
  });
});
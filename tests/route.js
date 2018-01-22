'use strict';
const { expect } = require('chai');
const Route = require('../src/route');

describe('Generating routes', () => {

  beforeEach((done) => {
    Route.clear();
    done();
  });

  it('From json file should have length of 1', () => {
    Route.extractRoutesAndGenerate({
      routes: `${__dirname}/fixtures/routes_1.json`,
    });

    expect(Route.routes('all')).to.have.lengthOf(1);
  });

  it('From json object should have length of 1', () => {
    Route.extractRoutesAndGenerate({
      routes: {
        '/': {
          'get': 'route#get'
        }
      }
    });
    expect(Route.routes('all')).to.have.lengthOf(1);
  });

  it('From json object should have length of 3', () => {
    Route.extractRoutesAndGenerate({
      routes: {
        '/': {
          'get': 'route#get'
        },
        '/api': {
          '/user': {
            'get': {
              'controller': 'route',
              'action': 'get'
            },
            'post': {
              'controller': 'route',
              'action': 'post'
            }
          }
        }
      }
    });
    expect(Route.routes('all')).to.have.lengthOf(3);
  });
});
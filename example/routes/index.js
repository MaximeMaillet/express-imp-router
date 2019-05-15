const express = require('express');
const app = express();
const router = require('../../index');

router(app);
router.enableDebug();
router.route([
  {
    controllers: `${__dirname}/controllers`,
    route_mode: 'strict',
    routes: {
      '/string': {
        get: 'HomeController#homeString',
        '/second': {
          get: ['HomeController#homeStringFirst', 'HomeController#homeStringSecond']
        }
      },
      '/object': {
        get: {
          controller: 'HomeController',
          action: 'homeObject'
        },
        '/second': {
          get: [
            {
              controller: 'HomeController',
              action: 'homeObjectFirst'
            },
            {
              controller: 'HomeController',
              action: 'homeObjectSecond'
            }
          ]
        },
      },
      '/function': {
        get: (req, res) => {res.send('Home function');},
        '/second': {
          get: [
            (req, res, next) => {console.log('Home function first'); next();},
            (req, res) => {res.send('Home function second')}
          ]
        }
      },
      '/public': {
        '_static_': {
          targets: ['public', 'media'],
        }
      }
    }
  }
]);

app.listen(8080);
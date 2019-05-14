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
        },
        '/no': {
          get: 'HomeController#home'
        }
      },
      // '/object': {
      //   get: {
      //     controller: 'HomeController',
      //     action: 'homeObject'
      //   },
      //   '/second': {
      //     get: [
      //       {
      //         controller: 'HomeController',
      //         action: 'homeObjectFirst'
      //       },
      //       {
      //         controller: 'HomeController',
      //         action: 'homeObjectSecond'
      //       }
      //     ]
      //   }
      // }
    }
  }
]);

app.listen(8080);
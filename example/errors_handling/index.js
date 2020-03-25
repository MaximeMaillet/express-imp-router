const express = require('express');
const app = express();
const router = require('express-imp-router');

router(app);
router.enableDebug();
router.route([
  {
    controllers: `${__dirname}/controllers`,
    middlewares: `${__dirname}/middlewares`,
    routes: {
      '/first-error': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['errors#firstError'],
          level: router.MIDDLEWARE.LEVEL.ERROR,
        },
        get: 'HomeController#throwError',
        '/second-error': {
          [router.IMP.MIDDLEWARE]: {
            controllers: ['errors#firstSecondError'],
            level: router.MIDDLEWARE.LEVEL.ERROR,
          },
          get: 'HomeController#throwError',
        }
      },
      '/first-error-async': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['errors#firstError'],
          level: router.MIDDLEWARE.LEVEL.ERROR,
        },
        get: 'HomeController#throwErrorAsync',
      },
      '/second-error': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['errors#secondError'],
          level: router.MIDDLEWARE.LEVEL.ERROR,
        },
        get: 'HomeController#throwError',
      }
    }
  }
]);

app.listen(8080);
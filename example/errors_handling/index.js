const express = require('express');
const app = express();
const router = require('../../index');

router(app);
router.enableDebug();
router.route([
  {
    controllers: `${__dirname}/controllers`,
    middlewares: `${__dirname}/middlewares`,
    routes: {
      '/first-error': {
        '_middleware_': {
          controllers: ['errors#firstError'],
          level: router.MIDDLEWARE_LEVEL.ERROR,
        },
        get: 'HomeController#throwError',
        '/second-error': {
          '_middleware_': {
            controllers: ['errors#firstSecondError'],
            level: router.MIDDLEWARE_LEVEL.ERROR,
          },
          get: 'HomeController#throwError',
        }
      },
      '/first-error-async': {
        '_middleware_': {
          controllers: ['errors#firstError'],
          level: router.MIDDLEWARE_LEVEL.ERROR,
        },
        get: 'HomeController#throwErrorAsync',
      },
      '/second-error': {
        '_middleware_': {
          controller: 'errors#secondError',
          level: router.MIDDLEWARE_LEVEL.ERROR,
        },
        get: 'HomeController#throwError',
      },
      '*': {
        '_middleware_': {
          controller: 'errors#allError',
          level: router.MIDDLEWARE_LEVEL.ERROR,
        }
      }
    }
  }
]);

app.listen(8080);
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
      '/app': {
        '/name': {
          [router.IMP.MIDDLEWARE]: {
            controllers: ['user#getName']
          },
          get: 'HomeController#homeName',
        },
        '/age': {
          [router.IMP.MIDDLEWARE]: {
            controllers: [
              {
                controller: 'user',
                action: 'getAge'
              }
            ]
          },
          get: 'HomeController#homeAge',
        },
        '/city': {
          [router.IMP.MIDDLEWARE]: {
            controllers: [
              (req, res, next) => {
                req.data = {
                  city: 'Lyon, France'
                };
                next();
              }
            ]
          },
          get: 'HomeController#homeCity',
        },
      },
      '/method': {
        '/get': {
          [router.IMP.MIDDLEWARE]: {
            controllers: ['user#getFriends'],
            method: router.METHOD.GET,
          },
          get: 'HomeController#homeFriends',
          post: 'HomeController#homeFriends',
        }
      },
      '/inherit': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['cors#checkOrigin'],
          inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
        },
        get: 'HomeController#home',
        '/child': {
          get: 'HomeController#home',
        }
      },
      '/error': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['error#catchError'],
          level: router.MIDDLEWARE.LEVEL.ERROR,
        },
        get: 'HomeController#homeError',
        '/child': {
          get: 'HomeController#homeError',
        }
      },
      '/global': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['cors#checkOrigin'],
          level: router.MIDDLEWARE.LEVEL.GLOBAL,
        },
        get: 'HomeController#home',
        '/child': {
          get: 'HomeController#home',
        }
      },
      '/notfound': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['error#notFound'],
          level: router.MIDDLEWARE.LEVEL.NOT_FOUND,
        }
      },
    }
  }
]);

app.listen(8080);

const express = require('express');

const app = express();

const router = require('../../index');
router(app);
router.enableDebug();
router.route([
  {
    controllers: `${__dirname}/controllers1`,
    middlewares: `${__dirname}/middlewares`,
    routes: {
      '/': {
        'get': ['HomeController#home', 'HomeController#home2']
      },
      '/public': {
        '_static_': {
          'targets': ['example/complete//public', 'example/complete/media'],
          'options': {}
        }
      },
      '/middleware': {
        '_middleware_': {
          'controllers': ['withName/getName#getName', 'consolelog#selfLog', 'consolelog#log'],
          'level': router.MIDDLEWARE_LEVEL.APP,
          'method': router.METHOD.ALL,
        },
        'get': 'MiddlewareController#get',
        '/other': {
          '_middleware_': {
            'controllers': [{
              'controller' : 'withName/getName',
              'action': 'getName2'
            }]
          },
          'get': 'MiddlewareController#get',
          'post': 'MiddlewareController#post',
        }
      },
      '/one': {
        '_middleware_': {
          controllers: [express.json()],
          level: router.MIDDLEWARE_LEVEL.APP,
          method: [router.METHOD.GET, router.METHOD.PATCH]
        },
        'get': {
          controller: 'NumberController',
          action: 'getOne',
        },
        'post': {
          'controller': 'NumberController',
          'action': 'postOne'
        },
        'patch': {
          'controller': 'NumberController',
          'action': 'patchOne'
        },
        '/two': {
          '_middleware_': {
            controllers: ['consolelog#selfLog'],
            level: router.MIDDLEWARE_LEVEL.APP,
            method: [router.METHOD.GET, router.METHOD.ALL]
          },
          'get': 'NumberController#getTwo',
          'put': 'NumberController#putTwo',
          'patch': 'NumberController#patchTwo',
          'delete': 'NumberController#deleteTwo'
        }
      },
      '/three': {
        'get': {
          'controller': 'NumberController',
          'action': 'getThree'
        }
      },
      '/four': {
        'get': (req, res) => {res.send('4');}
      },
      '/five/six': {
        'get': 'NumberController#getFiveSix'
      },
      '/params/:id': {
        'get': 'HomeController#getParams'
      },
      '/error': {
        '/throw': {
          'get': 'FailController#throw'
        },
        '/err': {
          'get': 'FailController#err'
        }
      },
      '/test_err': {
        'get': 'FailController#err'
      },
      '/error*': {
        '_middleware_': {
          controller: 'error-handler#handleJSON',
          level: router.MIDDLEWARE_LEVEL.ERROR
        }
      },
      '/*': {
        '_middleware_': [
          {controller: 'error-handler#handleHTML', level: router.MIDDLEWARE_LEVEL.ERROR},
          {controller: 'error-handler#notFound', level: router.MIDDLEWARE_LEVEL.NOT_FOUND},
        ],
      }
    }
  },
  {
    config: {route_mode: 'strict'},
    controllers: `${__dirname}/controllers2`,
    routes: `${__dirname}/complete_route.json`
  }
]);

/**
 * Routes to test
 *
 * GET "/"            => return "Home"
 * GET "/one"         => return 1
 * GET "/one/two"     => return 2
 * GET "/three"       => return 3
 * GET "/four"        => return 4
 * GET "/five/six"    => return 30
 * POST "/one"        => return {"success": true}
 * PATCH "/one/two"   => return {"success": true}
 * DELETE "/one/two"  => return {"success": true}
 * PUT "/one/two"     => return {"success": true}
 */

app.listen(8080);
const express = require('express');
const app = express();

const router = require('../index');

router(app);
router.enableDebug();

router.route([
  {
    controllers: `${__dirname}/controllers`,
    routes: {
      "/": {
        "get": "HomeController#home"
      },
      "/public": {
        "_static_": {
          "targets": ["example/public", "example/public_bis"],
          "options": {}
        }
      },
      "/one": {
        "get": "NumberController#getOne",
        "post": "NumberController#postOne",
        "/two": {
          "get": "NumberController#getTwo",
          "put": "NumberController#putTwo",
          "patch": "NumberController#patchTwo",
          "delete": "NumberController#deleteTwo"
        }
      },
      "/three": {
        "get": {
          "controller": "NumberController",
          "action": "getThree"
        }
      },
      "/four": {
        "get": (req, res) => {res.send("4")}
      },
      "/five/six": {
        "get": "NumberController#getFiveSix"
      },
      "/params/:id": {
        "get": "HomeController#getParams"
      },
      "/error": {
        "/throw": {
          "get": "FailController#throw"
        },
        "/err": {
          "get": "FailController#err"
        }
      }
    }
  },
  {
    controllers: `${__dirname}/controllers_bis`,
    routes: `${__dirname}/routes_simple.json`
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
const express = require('express');
const app = express();

const router = require('../index');

router(app);
router.enableDebug();

router.route([{
  controllers: `${__dirname}/controllers`,
  middlewares: `${__dirname}/middlewares`,
  services: `${__dirname}/services`,
  routes: {
    "/": {
      "get": "HomeController#home"
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
    }
  }
}]);

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
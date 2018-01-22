const express = require('express');
const app = express();

const router = require('../index');

router(app);

router.route([{
  routes: `${__dirname}/routes.json`,
  controllers: `${__dirname}/controllers`
}]);

app.listen(6060);
module.exports.startServer = async(port, config) => {
  const express = require('express');
  const app = express();
  const router = require('../index');
  router(app);

  router.route(config);

  const server = app.listen(port);

  return {app, server};
};

require('./routes/index');
// require('./middlewares/index');
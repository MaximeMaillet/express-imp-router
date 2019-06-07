// module.exports.startServer = async(port, config, debug) => {
//   const express = require('express');
//   const app = express();
//   const router = require('../index');
//   if(debug) {
//     router.enableDebug();
//   }
//   router(app);
//
//   router.route(config);
//
//   const server = app.listen(port);
//
//   return {app, server};
// };

// require('./routes/index'); // 6060
// require('./middlewares/index'); // 6061
// require('./services/index'); // 6062
// require('./errorHandlers/index');
// view engine

require('./units/extracts');
require('./units/generate');

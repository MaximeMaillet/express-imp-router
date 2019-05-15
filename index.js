module.exports = require('./src/index');
module.exports.MIDDLEWARE_LEVEL = require('./src/config/middleware');
module.exports.METHOD = require('./src/config/methods');
const errors = require('./src/config/errors');
module.exports.ERRORS = errors;
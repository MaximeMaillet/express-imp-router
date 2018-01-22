'use strict';

const multer  = require('multer');

module.exports.run = multer({
  dest: `${__dirname}/../resources/`
}).any();
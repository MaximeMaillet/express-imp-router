const debug = require('debug');
const errorExtractor = require('../extract/errors.js');
let errors = [], isDebug = false;

module.exports = {
  extract,
  enableDebug,
  get,
};

function extract(configAll) {
  debug('Start extract errors');

  for(const i in configAll) {
    errors = errors.concat(errorExtractor.route(configAll[i], configAll[i].routes, isDebug));
  }

  console.log('FIND ERR');
  console.log(errors);
  debug('Extract errors : done');
  return errors;
}

function enableDebug() {
  isDebug = true;
}

function get(level) {
  return errors.filter(item => item.level === level);
}
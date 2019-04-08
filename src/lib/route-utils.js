const methods = require('../config/methods');

module.exports = {
  isMethod,
  isEndpoint,
  isString,
  isStatic,
  isFunction,
  isObject,
};

function isMethod(key) {
  return methods.indexOf(key.toUpperCase()) !== -1;
}

function isEndpoint(key) {
  return key.startsWith('/');
}

function isString(key) {
  return typeof key === 'string';
}

function isStatic(key) {
  return typeof key === 'string' && key === '_static_';
}

function isFunction(key) {
  return typeof key === 'function';
}

function isObject(key) {
  return typeof key === 'object';
}
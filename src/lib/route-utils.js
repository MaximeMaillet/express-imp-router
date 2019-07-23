const methods = require('../config/methods');
const impKeywords = require('../config/imp-keywords');

module.exports = {
  isMethod,
  isEndpoint,
  isString,
  isStatic,
  isFunction,
  isObject,
  isImpKeyword,
};

function isMethod(key) {
  return Object.values(methods).indexOf(key.toUpperCase()) !== -1;
}

function isEndpoint(key) {
  return key.startsWith('/');
}

function isString(key) {
  return typeof key === 'string';
}

function isStatic(key) {
  return typeof key === 'string' && key === impKeywords.STATIC;
}

function isFunction(key) {
  return typeof key === 'function';
}

function isObject(key) {
  return !Array.isArray(key) && typeof key === 'object';
}

function isImpKeyword(key) {
  return Object.values(impKeywords).indexOf(key.toLowerCase()) !== -1;
}
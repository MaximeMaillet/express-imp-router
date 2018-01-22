'use strict';

module.exports.throw = (req, res) => {
  throw new Error('Fail script');
};

module.exports.err = (req, res) => {
  const i = 1;
  i = 2;
};
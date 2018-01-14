'use strict';

module.exports.get = (req, res, next) => {
  res.status(200).send('ok');
};

module.exports.fail = (req, res, next) => {
  return next(new Error('Fail'));
};

module.exports.error = (req, res, next) => {
  throw new Error('Module not found');
};

module.exports.notAuthorized = (req, res, next) => {
  res.status(401).send('Not authorized');
};

module.exports.notFoundError = (req, res, next) => {
  res.status(200).send({msg: 'Not found, but its ok'});
};

module.exports.internalError = (req, res, next) => {
  res.status(200).send('Everythings is good');
};
'use strict';

module.exports.notFoundError = (req, res) => {
  return res.status(404).send('Oups');
};

module.exports.internalError = (req, res) => {
  return res.status(500).send(req.error.message);
};
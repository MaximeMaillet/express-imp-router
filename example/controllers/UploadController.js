'use strict';

module.exports.upload = (req, res, next) => {
  console.log(req.files);
  res.send({coucou: 'coucou'});
};

module.exports.up = (req, res, next) => {
  console.log(req.files);
  res.send({coucou: 'coucou'});
};
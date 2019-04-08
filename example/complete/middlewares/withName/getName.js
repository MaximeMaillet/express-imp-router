module.exports = {
  getName,
  getName2,
};

function getName(req, res, next) {
  req.middleware_name = 'getName';
  next();
}

function getName2(req, res, next) {
  req.middleware_name = 'getName2';
  next();
}
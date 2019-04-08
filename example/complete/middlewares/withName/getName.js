module.exports = {
  getName,
};

function getName(req, res, next) {
  req.middleware_name = 'getName';
  next();
}
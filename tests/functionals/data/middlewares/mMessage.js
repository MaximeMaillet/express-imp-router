module.exports = {
  hi,
  hello,
  world,
  thank,
};

function hi(req, res, next) {
  req.customMessage = 'hi';
  next();
}

function hello(req, res, next) {
  req.customMessage = 'hello';
  next();
}

function world(req, res, next) {
  req.customMessage = 'world';
  next();
}

function thank(req, res, next) {
  req.customMessage = 'thank';
  next();
}
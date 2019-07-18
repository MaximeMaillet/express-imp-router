module.exports = {
  get,
  post,
  patch,
  put,
  delete: _delete,
  head,
  connect,
  options,
  trace,
};

function get(req, res, next) {
  req.methodName = 'GET';
  next();
}

function post(req, res, next) {
  req.methodName = 'POST';
  next();
}

function patch(req, res, next) {
  req.methodName = 'PATCH';
  next();
}

function put(req, res, next) {
  req.methodName = 'PUT';
  next();
}

function _delete(req, res, next) {
  req.methodName = 'DELETE';
  next();
}

function head(req, res, next) {
  req.methodName = 'HEAD';
  next();
}

function connect(req, res, next) {
  req.methodName = 'CONNECT';
  next();
}

function options(req, res, next) {
  req.methodName = 'OPTIONS';
  next();
}

function trace(req, res, next) {
  req.methodName = 'TRACE';
  next();
}
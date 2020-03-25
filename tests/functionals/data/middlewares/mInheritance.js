module.exports = {
  default: _default,
  none,
	desc,
  catchError,
  notFound,
  parent,
  children,
};

function _default(req, res, next) {
  req.result = 'Default';
	next();
}

function none(req, res, next) {
  req.result = 'None';
  next();
}

function desc(req, res, next) {
  req.result = 'Desc';
  next();
}

function catchError(err, req, res, next) {
  res.status(422).send({message: err.message});
}

function notFound(req, res, next) {
  res.status(404).send({message: 'not_found'});
}

function parent(req, res, next) {
  req.customMessage = 'parent';
  next();
}

function children(req, res, next) {
  req.customMessage = 'children';
  next();
}
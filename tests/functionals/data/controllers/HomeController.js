module.exports = {
  showMessage,
  showMethod,
  defaultInheritance,
  noneInheritance,
  descInheritance,
  check,
  throwError,
};

function showMessage(req, res) {
  res.status(200).send({message: req.customMessage});
}

function showMethod(req, res) {
  res.status(200).send({result: req.methodName});
}

function defaultInheritance(req, res) {
  res.status(200).send({result: req.result});
}

function noneInheritance(req, res) {
  res.status(200).send({result: req.result});
}

function descInheritance(req, res) {
  res.status(200).send({result: req.result});
}

function check(req, res) {
  res.status(200).send({result: req.result || 'null'});
}

function throwError(req, res) {
  throw new Error('Fail');
}
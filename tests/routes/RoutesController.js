function string(req, res) {
  res.send({message: 'OK'});
}

function object(req, res) {
  res.send({message: 'OK'});
}

async function secondString(req, res) {
  res.status(204).send();
}

async function secondObject(req, res) {
  res.status(204).send();
}

module.exports = {
  string,
  object,
  secondString,
  secondObject,
};
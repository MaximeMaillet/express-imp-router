function multiply(req, res) {
  res.send({
    result: req.services.math.multiply(req.params.x, req.params.y)
  })
}

function add(req, res) {
  res.send({
    result: req.services.math.add(req.params.x, req.params.y)
  })
}

function divide(req, res) {
  res.send({
    result: req.services.math.divide(req.params.x, req.params.y)
  })
}

function cos(req, res) {
  res.send({
    result: req.services.circle.cos(req.params.x)
  })
}

function sin(req, res) {
  res.send({
    result: req.services.circle.sin(req.params.x)
  })
}

function getOneUser(req, res) {
  const user = req.services.user.getOneById(parseInt(req.params.id));
  if(!user) {
    res.status(404).send();
  }

  res.send(user);
}

function getAllUsers(req, res) {
  res.send(req.services.user.getAll());
}

module.exports = {
  add,
  multiply,
  divide,
  cos,
  sin,
  getOneUser,
  getAllUsers,
};
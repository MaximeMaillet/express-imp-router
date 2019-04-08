module.exports = {
  home,
  home2,
  getAllParams,
  getNumberParams,
};

function home(req, res) {
  res.send('Welcome Home, in controller2 directory!')
}

function home2(req, res) {
  res.send('Welcome Home, in controller2 directory, second method!')
}

function getAllParams(req, res) {
  res.send({HomeControllerBis: req.params.id});
}

function getNumberParams(req, res) {
  res.send({HomeControllerBis: req.params.id});
}
module.exports = {
  home,
  getParams,
};

function home(req, res) {
  res.send('Welcome Home !')
}

function getParams(req, res) {
  res.send({HomeControllerBis: req.params.id});
}
module.exports = {home, getParams};

function home(req, res) {
  res.send('Home');
};

function getParams(req, res) {
  res.send({HomeController: req.params.id});
}
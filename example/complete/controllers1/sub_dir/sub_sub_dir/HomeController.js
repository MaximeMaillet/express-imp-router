module.exports = {home, home2, getParams};

function home(req, res, next) {
  if(req.query.skipFirst) {
    return next('route');
  }
  res.send('Welcome home, in controller1, first method');
};

function home2(req, res, next) {
  if(req.query.skipSecond) {
    return next('route');
  }
  res.send('Welcome home, in controller1, second method');
};

function getParams(req, res) {
  res.send({HomeController: req.params.id});
}
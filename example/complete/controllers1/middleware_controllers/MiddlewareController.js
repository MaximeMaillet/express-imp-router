module.exports = {
  get,
  post
};

function post(req, res) {
  res.send(`Request POST with middleware : ${req.middleware_name}`);
}

function get(req, res) {
  res.send(`Request GET with middleware : ${req.middleware_name}`);
}
module.exports = {
  get,
};

function get(req, res) {
  res.send(`Request with middleware : ${req.middleware_name}`);
}
function test(req, res, next) {
  req.started = {
    test: parseInt(req.params.number, 10),
  };
  next();
}

module.exports = {
  test,
};
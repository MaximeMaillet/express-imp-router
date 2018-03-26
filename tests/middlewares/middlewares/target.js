module.exports.test = (req, res, next) => {
  req.target = {
    test: parseInt(req.params.number, 10),
  };
  next();
};
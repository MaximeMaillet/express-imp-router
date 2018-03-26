module.exports.test = (req, res, next) => {
  req.middleware = {
    result: Math.pow(2, parseInt(req.params.number, 10))
  };
  next();
};
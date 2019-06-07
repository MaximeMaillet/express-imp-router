module.exports.handle = (req, res, next) => {
  res.status(404).send({
    message: `Not found : ${req.method} ${req.url} does not exists`
  });
};
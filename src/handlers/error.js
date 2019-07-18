module.exports = {
  handle,
};

function handle(err, req, res, next) {
  req.error = err;
  res.status(500).send({
    status: 500,
    message: 'An error is happened',
    stack: err.message
  });
}
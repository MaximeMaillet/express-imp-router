module.exports = {
  handle,
};

function handle(err, req, res, next) {
  req.error = err;
  console.log('ERROR HANDLE');

  res.status(500).send({
    status: 500,
    message: err.message
  });
}
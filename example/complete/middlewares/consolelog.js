module.exports = {
  log,
  selfLog,
};

function log(req, res, next) {
  console.log(req.query.log);
  next();
}

function selfLog(req, res, next) {
  console.log('Self log');
  next();
}
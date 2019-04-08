module.exports = {
  coucou,
}

function coucou(req, res, next) {
  console.log('Mon Middleware');
  next();
}
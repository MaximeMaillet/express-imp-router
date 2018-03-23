const bodyParser = require('body-parser');

async function create(req, res, next) {
  req.session = {
    isValid: () => {
      return (req.body && req.body.auth === 'Max' && req.body.password === 'Max');
    }
  };
  next();
}

module.exports = {
  bodyParser: bodyParser.json(),
  urlencoded: bodyParser.urlencoded({ extended: false }),
  create,
};
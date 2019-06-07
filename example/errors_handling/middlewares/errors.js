module.exports = {
  firstError,
  firstSecondError,
  secondError,
  allError,
};

async function firstError(err, req, res, next) {
  res.status(422).send('First error');
}

async function secondError(err, req, res, next) {
  res.status(422).send('Second error');
}

async function firstSecondError(err, req, res, next) {
  res.status(422).send('First-Second error');
}

async function allError(err, req, res, next) {
  res.status(422).send('All error');
}
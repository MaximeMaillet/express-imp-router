async function test(req, res) {

  const resultMiddleware = req.middleware.result;
  res.send({
    result: resultMiddleware
  });
}

async function createSession(req, res) {
  if(!req.session.isValid()) {
    res.status(401).send();
  } else {
    res.status(200).send();
  }
}

async function target(req, res) {
  res.send({
    result: req.target.test,
  });
}

async function started(req, res) {
  res.send({
    result: req.started.test,
  });
}

module.exports = {
  test,
  createSession,
  target,
  started,
};
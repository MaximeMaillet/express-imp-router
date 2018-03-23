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

module.exports = {
  test,
  createSession,
};
module.exports = {
  throwError,
  throwErrorAsync,
  error,
};

function throwError(req, res, next) {
  console.log('THROW');
  throw new Error('Error throwing');
}

async function throwErrorAsync(req, res, next) {
  try {
    console.log('THROW ASYNC');
    throw new Error('Error throwing');
  } catch(e) {
    next(e);
  }
}

async function error(req, res) {
  const test = 'test';
  test = 'ok';
  res.send();
}
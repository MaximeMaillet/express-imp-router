module.exports = {
  homeString,
  homeStringFirst,
  homeStringSecond,
  homeObject,
  homeObjectFirst,
  homeObjectSecond,
};

function homeString(req, res) {
  res.send('Home string');
}

function homeStringFirst(req, res, next) {
  console.log('Home string first');
  next();
}

function homeStringSecond(req, res) {
  res.send('Home string second');
}

function homeObject(req, res) {
  res.send('Home object ');
}

function homeObjectFirst(req, res, next) {
  console.log('Home object first');
  next();
}

function homeObjectSecond(req, res) {
  res.send('Home object second');
}
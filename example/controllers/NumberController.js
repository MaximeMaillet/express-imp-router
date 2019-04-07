module.exports = {
  getOne,
  getTwo,
  getThree,
  getFiveSix,
  postOne,
  patchTwo,
  deleteTwo,
  putTwo
};

function getOne(req, res) {
  res.send("1");
}

function getTwo(req, res) {
  res.send("2");
}

function getThree(req, res) {
  res.send("3");
}

function getFiveSix(req, res) {
  res.send("30");
}

function postOne(req, res) {
  res.send({success: true});
}

function patchTwo(req, res) {
  res.send({success: true});
}

function deleteTwo(req, res) {
  res.send({success: true});
}

function putTwo(req, res) {
  res.send({success: true});
}
module.exports = {
  handleJSON,
  handleHTML,
};

function handleJSON(err, req, res, next) {
  res.send({message: 'Everything is good !'});
}

function handleHTML(err, req, res, next) {
  res.send('<body><h1>Everything is good !</h1></body>');
}
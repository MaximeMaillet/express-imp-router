module.exports = {
  handleJSON,
  handleHTML,
};

function handleJSON(err, req, res, next) {
  res.send({title: 'Everything is good !', message: err.message});
}

function handleHTML(err, req, res, next) {
  res.send(`<body><h1>Everything is good !</h1><p>${err.message}</p></body>`);
}
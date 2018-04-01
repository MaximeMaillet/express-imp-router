function multiply($x, $y) {
  return parseInt($x, 10) * parseInt($y, 10);
}

function add($x, $y) {
  return parseInt($x, 10) + parseInt($y, 10);
}

function divide($x, $y) {
  if(parseInt($y, 10) === 0) {
    throw new Error('Divide by 0 ? No way !')
  }

  return parseInt($x, 10) / parseInt($y, 10);
}

module.exports = {
  add,
  multiply,
  divide,
};
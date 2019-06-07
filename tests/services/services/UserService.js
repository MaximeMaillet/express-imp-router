const users = [
  {id: 1, name: 'Max'},
  {id: 2, name: 'Johnny'},
];

function getOneById(id) {
  return users.filter((user) => user.id === id)[0];
}

function getAll() {
  return users;
}

module.exports = {
  getOneById,
  getAll,
};
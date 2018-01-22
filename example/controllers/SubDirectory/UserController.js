'use strict';

module.exports.get = (req, res) => {
  return res.send({
    name: 'Maxime',
    age: 8,
    skills: ['Unicorn'],
  });
};
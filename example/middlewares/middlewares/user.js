module.exports = {
	getName,
	getAge,
	getFriends,
};

function getName(req, res, next) {
	req.data = {
		username: 'Paulo'
	};
	next();
}

function getAge(req, res, next) {
	req.data = {
		age: 21
	};
	next();
}

function getFriends(req, res, next) {
	req.data = {
		friends: ['Pauline', 'Camille']
	};
	next();
}

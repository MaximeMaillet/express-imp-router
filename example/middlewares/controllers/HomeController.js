module.exports = {
	home,
	homeName,
	homeAge,
	homeFriends,
	homeCity,
	homeError,
};

function home(req, res) {
	res.send('Welcome');
}

function homeName(req, res) {
	res.send(`Welcome ${req.data.username}`);
}

function homeAge(req, res) {
	res.send(`Welcome, you are ${req.data.age} years old`);
}

function homeFriends(req, res) {
	res.send(`I have ${req.data && req.data.friends ? req.data.friends.length : 0} friend(s)`);
}

function homeCity(req, res) {
	res.send(`Welcome, you come from ${req.data.city}`);
}

function homeError(req, res) {
	throw new Error('Failed');
}

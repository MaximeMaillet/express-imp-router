module.exports = {
	checkOrigin,
};

function checkOrigin(req, res, next) {
	const whiteList = ['localhost:8080'];
	if(whiteList.indexOf(req.get('host')) === -1) {
		res.status(403).send('Access forbidden');
	} else {
		next();
	}
}

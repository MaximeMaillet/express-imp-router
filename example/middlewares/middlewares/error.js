module.exports = {
	catchError,
	notFound,
};

function catchError(err, req, res, next) {
	res.status(200).send({
		err: err.message,
		message: 'Not really matter'
	});
}


function notFound(req, res, next) {
	res.status(200).send({
		message: 'Not really found'
	});
}

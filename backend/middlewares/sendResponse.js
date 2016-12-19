module.exports = (req, res, next) => {

	res.sendResponse = function(data) {
		res.json({
			response: data
		})
	}

	next();
}
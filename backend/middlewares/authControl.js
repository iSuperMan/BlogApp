import { HttpError } from '../error'
import User from '../models/user'

module.exports = (req, res, next) => {
	if(!req.auth) {
		return next(new HttpError(401))
	}

	User.findById(req.auth._id, (err, user) => {
		if(err) {
			return next(err)
		}

		if(!user) {
			return next(new HttpError(401))
		}

		req.auth = user;

		next();
	})
}
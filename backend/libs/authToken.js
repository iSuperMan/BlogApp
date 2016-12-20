import jwt from 'jsonwebtoken'
import config from '../../config'

const secretToken = config.get('secretToken')

const generate = (user, callback) => {
	const u = {
		_id: user._id,
		username: user.username,
		email: user.email,
		fullName: user.fullName
	}

	var options = {
		// expiresIn: 60 * 60 * 2 // 2 hours expire
	}

	jwt.sign(u, secretToken, options, callback)
}

const verify = (token, callback) => {
	jwt.verify(token, secretToken, callback)
}

module.exports = {
	generate,
	verify
}
import express from 'express'
import authControl from '../../middlewares/authControl'
import bodyClean from '../../middlewares/bodyClean'
import User from '../../models/user'
import { HttpError } from '../../error'
import authToken from '../../libs/authToken'

const router = express.Router()

export default router

router.get('/initialization', [
	authControl,

	(req, res, next) => {
		return res.sendResponse({
			user: req.auth.toObject({mode: 'basic'})
		})
	}
])

router.post('/login', [
	(req, res, next) => {
		const { email, password } = req.body

		User.findOne({ email }, (err, user) => {
			if(err) {
				return next(err)
			}

			if(!user || !user.checkPassword(password || '')) {
				return res.sendResponse({
					success: false
				})
			} else {
				authToken.generate(user, (err, token) => {
					if(err) {
						return next(err)
					}

					return res.sendResponse({
						success: true,
						user: user.toObject({mode: 'basic'}),
						token
					})
				})
			}
		})
	}
])

router.post('/signup', [
	
	bodyClean([
		'email',
		'username',
		'password',
		'fullName'
	]),
	
	(req, res, next) => {
		User.create(req.body, (err, user) => {
			if(err) {
				if(err.errors) {
					// ошибки валидации
					return res.sendResponse({
						success: false,
						errors: err.errors
					})
				}
				return next(err)
			}

			authToken.generate(user, (err, token) => {
				if(err) {
					return next(err)
				}

				return res.sendResponse({
					success: true,
					user: user.toObject({mode: 'basic'}),
					token
				})
			})
		})
	},
])
import express from 'express'
import { Types } from 'mongoose'
import User from '../../models/user'
import authControl from '../../middlewares/authControl'

const router = express.Router()

export default router

router.param('id', (req, res, next, id) => {
	if(!Types.ObjectId.isValid(id)) {
		return next(404);
	}

	User.findById(id, (err, user) => {
		if(err) {
			return next(err)
		}

		if(!user) {
			return next(404)
		}

		req.user = user;
		next()
	})
})

router.get('/:id', [
	({user}, res, next) => {
		return res.sendResponse({
			user: user.toObject({mode: 'basic'})
		})
	}
])

router.get('/:id/follow', [
	authControl,

	({user, auth}, res, next) => {
		auth.followTo(user, err => {
			if(err) {
				return next(err)
			}

			return res.sendResponse({
				success: true
			})
		})
	}
])

router.get('/:id/unfollow', [
	authControl,

	({user, auth}, res, next) => {
		auth.unfollowTo(user, err => {
			if(err) {
				return next(err)
			}

			return res.sendResponse({
				success: true
			})
		})
	}
])
import express from 'express'
import authControl from '../../middlewares/authControl'
import bodyClean from '../../middlewares/bodyClean'
import Post from '../../models/post'
import { Types } from 'mongoose'

const router = express.Router()

export default router

router.post('/', [
	authControl,

	bodyClean([
		'title',
		'body'
	]),

	(req, res, next) => {
		Post.createDraft(req.auth, req.body, (err, post) => {
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

			post.formatDraftToClient((err, post) => {
				if(err) {
					return next(err);
				}

				return res.sendResponse({
					success: true,
					post: post
				})
			})

		})
	}
])

router.param('id', (req, res, next, id) => {
	if(!Types.ObjectId.isValid(id)) {
		return next(404);
	}

	Post.findById(id, (err, post) => {
		if(err) {
			return next(err)
		}

		if(!post) {
			return next(404)
		}

		req.post = post;
		next()
	})
})

const accessControl = ({post, auth}, res, next) => {
	if(post._author.equals(auth._id)) {
		return next()
	}

	next(403)
}

router.put('/:id', [

	authControl,
	accessControl,

	bodyClean([
		'title',
		'body'
	]),

	({post, body}, res, next) => {
		post.edit(body, (err, post) => {
			if(err) {
				return next(err)
			}

			post.formatDraftToClient((err, post) => {
				if(err) {
					return next(err);
				}

				return res.sendResponse({
					success: true,
					post: post
				})
			})		
		})
	}
])

router.get('/:id/publish', [
	authControl,
	accessControl,

	({post}, res, next) => {
		post.publish((err, post) => {
			if(err) {
				return next(err)
			}

			post.formatDraftToClient((err, post) => {
				if(err) {
					return next(err);
				}

				return res.sendResponse({
					post: post
				})
			})
		})
	}
])

router.get('/:id/edit', [
	authControl,
	accessControl,

	({post}, res, next) => {
		post.formatDraftToClient((err, post) => {
			if(err) {
				return next(err);
			}

			return res.sendResponse({
				post: post
			})
		})
	}
])

router.get('/:id', [

	({post}, res, next) => {
		if(!post.isPublic) {
			return next(404);
		}

		next();
	},

	({post}, res, next) => {
		post.formatPublicToClient((err, post) => {
			if(err) {
				return next(err);
			}

			return res.sendResponse({
				post: post
			})
		})
	}
])
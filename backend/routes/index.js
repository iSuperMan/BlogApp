import express from 'express'
import jwt from 'express-jwt'
import config from '../../config'
import auth from './auth'
import post from './post'
import user from './user'
import { HttpError } from '../error'
import notfound from '../middlewares/notfound'
import sendResponse from '../middlewares/sendResponse'
import sendHttpError from '../middlewares/sendHttpError'
import errorHandler from '../middlewares/errorHandler'

const router = express.Router()

router.use(sendResponse)
router.use(sendHttpError)

router.use(jwt({
	secret: config.get('secretToken'),
	requestProperty: 'auth',
	credentialsRequired: false
}))

router.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		return res.sendHttpError(new HttpError(401))
	}

	next();
})

router.use('/auth', auth)
router.use('/post', post)
router.use('/user', user)

router.use(notfound)
router.use(errorHandler)

export default router
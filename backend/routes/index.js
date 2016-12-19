import express from 'express'
import auth from './auth'
import notfound from '../middlewares/notfound'
import sendResponse from '../middlewares/sendResponse'
import sendHttpError from '../middlewares/sendHttpError'
import errorHandler from '../middlewares/errorHandler'

const router = express.Router()

router.use(sendResponse)
router.use(sendHttpError)

router.use('/auth', auth)

router.use(notfound)
router.use(errorHandler)

export default router
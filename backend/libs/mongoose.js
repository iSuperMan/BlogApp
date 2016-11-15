import mongoose from 'mongoose'
import config from '../../config'

const { uri, options } = process.env.NODE_ENV === 'test' ?
	config.get('mongoose-test') :
	config.get('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(uri, options)

export default mongoose
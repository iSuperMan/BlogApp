import mongoose, { Schema } from '../libs/mongoose'

const schema = new Schema({
	title: {
		type: String,
		trim: true,
		required: true
	},
	body: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	_coverImage: {
		isSet: {
			type: Boolean,
			default: false
		},
		path: {
			type: String
		}
	}
}, {
	timestamps: true
})

schema.virtual('coverImage')
	.get(function() {
		const { _coverImage } = this
		
		return _coverImage.isSet ? _coverImage.path : null
	})
	.set(function(val) {
		const { _coverImage } = this
		
		if(val) {
			_coverImage.isSet = true
			_coverImage.path = val
		} else {
			_coverImage.isSet = false
			delete _coverImage.path
		}
		
	})

const PostContent = mongoose.model('PostContent', schema)

export default PostContent
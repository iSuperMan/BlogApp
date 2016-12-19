import mongoose, { Schema } from '../libs/mongoose'
import waterfall from 'async/waterfall'

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

/**
 * Assign new values to instance props and save it
 * 
 * @param  {Object}   postContentData 	data from client
 * @param  {Function} callback
 */
schema.methods.updateInstance = function(postContentData, callback) {
	this.title = postContentData.title;
	this.body = postContentData.body;
	this.coverImage = postContentData.coverImage;

	this.save(err => {
		if(err) {
			return callback(err)
		}

		callback(null, this)
	})
}

/**
 * Find instance by id, assign new values to finding instance and save it
 * 
 * @param  {ObjectId}   id			  _id of postContent
 * @param  {Object}   postContentData  data from client
 * @param  {Function} callback 
 */
schema.statics.updateInstanceById = (id, postContentData, callback) =>
	waterfall([
		cb => PostContent.findById(id, cb),
		(postContent, cb) => postContent.updateInstance(postContent, cb)	
	], callback)

const PostContent = mongoose.model('PostContent', schema)

export default PostContent
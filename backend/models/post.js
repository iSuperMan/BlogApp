import mongoose, { Schema } from '../libs/mongoose'
import PostContent from './postContent'
import waterfall from 'async/waterfall';
import series from 'async/series';

const CHANGE_TYPE_AUTOSAVED = 'autosaved'
const CHANGE_TYPE_FIRST_PUBLISHED = 'first-published'
const CHANGE_TYPE_PUBLISHED_CHANGES = 'published-changes'
const CHANGE_TYPE_REVERT_CHANGES = 'revert-changes'

const changeSchema = new Schema({
	type: {
		type: String,
		enum: [ 
			CHANGE_TYPE_AUTOSAVED, 
			CHANGE_TYPE_FIRST_PUBLISHED, 
			CHANGE_TYPE_PUBLISHED_CHANGES, 
			CHANGE_TYPE_REVERT_CHANGES
		],
		required: true
	},
	_content: {
		type: Schema.Types.ObjectId,
		ref: 'PostContent',
		required: true
	}
}, {
	timestamps: true
})

const schema = new Schema({
	_author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	isPublic: {
		type: Boolean,
		default: false
	},
	_publicContent: {
		type: Schema.Types.ObjectId,
		ref: 'PostContent'
	},
	_draftContent: {
		type: Schema.Types.ObjectId,
		ref: 'PostContent',
		required: true
	},
	changesHistory: [changeSchema],
	isBan: {
		type: Boolean,
		default: false,
	},
	hasUnpublishedChanges: {
		type: Boolean,
		default: false	
	},
	likedBy: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	likeCount: {
		type: Number,
		default: 0
	},
	viewCount: {
		type: Number,
		default: 0
	},
	publishedDate: {
		type: Date
	},
	lastEditedDate: {
		type: Date
	}
}, {
	timestamps: true
})

/**
 * Push new postContent to changesHistory array
 * 
 * @param  {PostContent} postContent
 * @param  {String} type 	the type of change
 *                        
 */
schema.methods.pushContentToChangesHistory = function(postContent, type) {
	this.changesHistory.push({
		type,
		_content: postContent.id
	})
}

/**
 * Push new postContent with `autosaved` type to changesHistory array
 * 
 * @param  {PostContent} postContent
 */
schema.methods.pushAutosavedContentToChangesHistory = function(postContent) {
	this.pushContentToChangesHistory(postContent, CHANGE_TYPE_AUTOSAVED);
}

/**
 * Set current date to lastEditedDate property
 * 
 */
schema.methods.updateLastEditedDate = function() {
	this.lastEditedDate = new Date()
}

/**
 * Get last modifiction of post's content from changesHistory array
 * 
 * @return {Object|Null}
 */
schema.methods.getLastChange = function() {
	const length = this.changesHistory.length
	
	if(length > 0) {
		return this.changesHistory[length - 1]
	}
	
	return null
}

/**
 * Check is i should update last change instance or
 * i should create new instance 
 * 
 * @return {Boolean}
 */
schema.methods.isShouldUpdateLastChange = function() {
	const lastChange = this.getLastChange()

	// should update only if change's type equals 'autosaved'	
	if(!lastChange || lastChange.type !== CHANGE_TYPE_AUTOSAVED) {
		return false;
	}

	const dateDiff = (new Date()) - lastChange.updatedAt;
	return dateDiff < 60000; // should update if passed no more than 1 min
}

schema.methods.updateLastChange = function(contentData, callback) {
	const lastChange = this.lastChange()
	PostContent.updateInstanceById(lastChange._content, contentData, callback);
}

schema.methods.createAutosavedChange = function(contentData, callback) {
	waterfall([
		cb => PostContent.create(contentData, cb),
		(postContent, cb) => {
			this.pushAutosavedContentToChangesHistory(postContent)
			cb()
		} 
	], callback)
}

schema.methods.editDraft = function(contentData, callback) {
	series([
		cb => {
			if(this.isShouldUpdateLastChange()) {
				this.updateLastChange(contentData, cb)
			} else {
				this.createAutosavedChange(contentData, cb)
			}			
		},
		cb => {
			this.updateLastEditedDate()
			this.save(cb)
		}
	], callback)
}

/**
 * Create draft of post
 * 
 * @param  {User}   author      
 * @param  {Object}   contentData  initial data of draft 
 *                                 { title, body, coverImage }
 * @param  {Function} callback   
 */
schema.statics.createDraft = (author, contentData, callback) => {
	waterfall([

		// create postContent instance
		cb => PostContent.create(contentData, cb),
		
		// create, setup and save post
		(postContent, cb) => {
			const post = new Post({ 
				_author: author.id, 
				_draftContent: postContent.id 
			})

			post.pushAutosavedContentToChangesHistory(postContent)
			post.updateLastEditedDate()

			post.save(err => {
				if(err) {
					return cb(err)
				}

				cb(null, post)
			})
		}
	], callback)
}

const Post = mongoose.model('Post', schema)

export default Post
import crypto from 'crypto'
import validator from 'validator'
import mongoose, { Schema } from '../libs/mongoose'
import series from 'async/series'
import parallel from 'async/parallel'

/**
 * Check email to existing and return
 * a result of check to callback function
 * 
 * @param  {String} email
 * @param  {Function} respond - callback with bool result of check
 */
export const emailUniqueValidator = function(email, respond) {
	User.findOne({email}, (err, user) => {
		if(err || user && user.id !== this.id) {
			return respond(false)
		}
		respond(true)
	})
}

/**
 * Check username to existing and return 
 * a result of check to callback function
 * 
 * @param  {String} username
 * @param  {Function} respond - callback with bool result of check
 */
export const usernameUniqueValidator = function(username, respond) {
	User.findOne({username}, (err, user) => {
		if(err || user && user.id !== this.id) {
			return respond(false)
		}
		respond(true)
	})
}

const schema = new Schema({
	email: {
		type: String,
		trim: true,
		required: true,
		validate: [{ 
			validator: val => validator.isEmail(val),
			message: 'Invalid `{PATH}` value ("{VALUE}")'
		},{
			validator: emailUniqueValidator,
			message: 'Email is already existing'    
		}]
	},
	username: {
		type: String,
		trim: true,
		required: true,
		maxlength: [20, 'Length should be not more than 20 characters'],
		minlength: [5, 'Length should be not less than 5 characters'],
		match: [
			/^[a-z0-9._]+$/,
			'Not allowed charaters in `{PATH}`'
		],
		validate: {
			validator: usernameUniqueValidator,
			message: 'Username is already existing'
		}
	},
	fullName: {
		type: String,
		trim: true,
	},
	hashedPassword: {
		type: String,
		default: '' // run validation
	},
	salt: {
		type: String
	},
	followers: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	following: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
}, {
	timestamps: true
})

schema.virtual('password')
	.set(function(password) {
		this._plainPassword = password
		this.setSalt()
		this.hashedPassword = this.encryptPassword(password)
	})
	.get(function() {
		return this._plainPassword || '';
	})

/*
   virtual fields do not provide a validation,
   cause we handle the validator on 'hashedPassword' and
   assign errors to 'password' virtual field
 */
schema.path('hashedPassword').validate(function() {
	const { isNew , _plainPassword } = this
	
	if (isNew) {
		if (!_plainPassword) {
			this.invalidate('password', 'Password is required')
		} else if(_plainPassword.length < 5) {
			this.invalidate('password', 'Password length should be not less than 5 characters')
		} else if(_plainPassword.length > 20) {
			this.invalidate('password', 'Password length should be not more than 20 characters')
		}
	}
}, null)

/**
 * Set random salt
 */
schema.methods.setSalt = function() {
	this.salt = Math.random() + ''
}

/**
 * Encrypt password
 * 
 * @param  {String} password
 * @return {String}
 */
schema.methods.encryptPassword = function(password) {
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

/**
 * Check password
 * 
 * @param  {String}
 * @return {Bool}
 */
schema.methods.checkPassword = function(password) {
	return this.encryptPassword(password) === this.hashedPassword
}

/**
 * Follow to user
 * 
 * @param  {User}   taraget to follow
 * @param  {Function}   callback
 */
schema.methods.followTo = function(user, callback) {
	series([
		cb => this.pushToFollowing(user, cb),
		cb => user.pushToFollowers(this, cb)
	], callback)
}

/**
 * Unfollow to user
 * 
 * @param  {[type]}   user  target to unfollow
 * @param  {Function}   callback
 */
schema.methods.unfollowTo = function(user, callback) {
	series([
		cb => this.pullFromFollowing(user, cb),
		cb => user.pullFromFollowers(this, cb)
	], callback)
}

/**
 * Add user to following list
 * 
 * @param  {User}   followingUser
 * @param  {Function} callback
 */
schema.methods.pushToFollowing = function(followingUser, callback) {
	this.following.push(followingUser)
	this.save(err => {
		if(err) {
			return callback(err);
		}
		callback(null, followingUser);
	})
}

/**
 * Remove user from following list
 * 
 * @param  {User} followingUser
 * @param  {Function} callback
 */
schema.methods.pullFromFollowing = function(followingUser, callback) {
	this.following.pull(followingUser)
	this.save(err => {
		if(err) {
			return callback(err);
		}
		callback(null, followingUser);
	})
}

/**
 * Add user to followers list
 * 
 * @param  {User} follower 
 * @param  {Function} callback
 */
schema.methods.pushToFollowers = function(follower, callback) {
	this.followers.push(follower)
	this.save(err => {
		if(err) {
			return callback(err);
		}
		callback(null, follower);
	})
}

/**
 * Remove user from followers list
 * 
 * @param  {User} follower
 * @param  {Function} callback
 */
schema.methods.pullFromFollowers = function(follower, callback) {
	this.followers.pull(follower);
	this.save(err => {
		if(err) {
			return callback(err)
		}
		callback(null, follower);
	})
}

if (!schema.options.toObject) schema.options.toObject = {};
schema.options.toObject.transform = function (doc, ret, options) {

	delete ret.salt;
	delete ret.hashedPassword;
	delete ret.updatedAt;
	delete ret.createdAt;

	if(options.mode && options.mode === 'basic') {
		delete ret.following;
		delete ret.followers;
	}

	return ret;
}

const User = mongoose.model('User', schema)

export default User
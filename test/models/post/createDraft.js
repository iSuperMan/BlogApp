import { expect } from 'chai'
import async from 'async'
import series from 'async/series'
import User from '../../../backend/models/user'
import Post from '../../../backend/models/post'
import PostContent from '../../../backend/models/postContent'
import * as postContentFactories from '../../__factories__/postContent'
import * as userFactories from '../../__factories__/user'

export default () => {

	const user1 = new User(userFactories.getUser1())

	before(done => {
		series([
			cb => User.remove({}, cb),
			cb => user1.save(cb)
		], done)
	})

	after(done => {
		User.remove({}, done)
	})
	// TODO not done yet
	it('should correct save `post` and `postContent` to DB', done => {
		const postContent = postContentFactories.getPostContent1();

		async.waterfall([
			
			cb => Post.createDraft(user1, postContent, (err, post) => {
				expect(err).to.not.exist
				expect(post).to.exist

				expect(post._author.toString()).to.equal(user1.id)
				expect(post.changesHistory[0]._content.toString()).to.equal(post._draftContent.toString())
				expect(post.changesHistory[0].type).to.equal('autosaved')

				cb(null, post)
			}),

			(post, cb) => Post.findById(post.id, (err, _post) => {
				expect(err).to.not.exist
				expect(_post).to.exist
				const date = new Date()

				cb(null, post)
			}),

			(post, cb) => PostContent.findById(post._draftContent, (err, _postContent) => {
				expect(err).to.not.exist
				expect(_postContent).to.exist

				cb()
			})
		], done)
	})
}
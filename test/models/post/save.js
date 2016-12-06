import { expect } from 'chai'
import Post from '../../../backend/models/post'
import * as postFactories from '../../__factories__/post'

export default () => {

	afterEach(done => {
		Post.remove({}, done)
	})

	it('should save doc wihout error', done => {

		const { _author, _draftContent } = postFactories.getPost1()

		Post.create({ _author, _draftContent }, (err, doc) => {
			expect(err).to.not.exist
			expect(doc).to.exist
			expect(doc._author).to.equal(_author)
			expect(doc._draftContent).to.equal(_draftContent)
			done();
		})
	})

	it('should give back error if `_author` is not specified', done => {

		const { _draftContent } = postFactories.getPost1()

		Post.create({ _draftContent }, (err, doc) => {
			expect(doc).to.not.exist
			expect(err).to.exist
			expect(err.errors._author).to.exist
			done()
		})
	})

	it('should give back error if `_draftContent` is not specified', done => {

		const { _author } = postFactories.getPost1()

		Post.create({ _author }, (err, doc) => {
			expect(doc).to.not.exist
			expect(err).to.exist
			expect(err.errors._draftContent).to.exist
			done()
		})	
	})

	it('should assign correct default values', done => {

		const post = postFactories.getPost1()

		Post.create(post, (err, doc) => {
			expect(err).to.not.exist
			expect(doc).to.exist

			expect(doc.isPublic).to.be.false
			expect(doc.changesHistory).to.be.instanceof(Array)
			expect(doc.changesHistory).to.be.empty
			expect(doc.isBan).to.be.false
			expect(doc.hasUnpublishedChanges).to.be.false
			expect(doc.likedBy).to.be.instanceof(Array)
			expect(doc.likedBy).to.be.empty
			expect(doc.likeCount).to.equal(0)
			expect(doc.viewCount).to.equal(0)

			done()
		})
	})

	it('should save with correct `change` sub-doc in `changesHistory` array', done => {

		const post = new Post(
			postFactories.getPost1()
		)

		post.changesHistory.push(
			postFactories.getChange1()
		)

		post.save(err => {
			expect(err).to.not.exist

			done();
		})
	})

	it('should give back error if `change` sub-doc do not contain `_content` prop', done => {
		const post = new Post(
			postFactories.getPost1()
		)

		const { type } = postFactories.getChange1()
		post.changesHistory.push({ type })

		post.save(err => {
			expect(err).to.exist
			expect(err.errors['changesHistory.0._content']).to.exist
			done();
		})
	})

	it('should give back error if `change` sub-doc does not contain `type` prop', done => {
		const post = new Post(
			postFactories.getPost1()
		)

		const { _content } = postFactories.getChange1()
		post.changesHistory.push({ _content })

		post.save(err => {
			expect(err).to.exist
			expect(err.errors['changesHistory.0.type']).to.exist
			done();
		})
	})

	it('should give back error if `type` prop of `change` sub-doc is not in enum', done => {
		const post = new Post(
			postFactories.getPost1()
		)

		post.changesHistory.push(
			postFactories.getChange1(null, { type: 'random'})
		)

		post.save(err => {
			expect(err).to.exist
			expect(err.errors['changesHistory.0.type']).to.exist
			done();
		})
	})
}
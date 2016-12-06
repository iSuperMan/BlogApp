import { expect } from 'chai'
import PostContent from '../../../backend/models/postContent'
import * as postContentFactories from '../../__factories__/postContent'

export default () => {

	afterEach(done => {
		PostContent.remove({}, done)
	})

	it('should save doc wihout error', done => {

		const { title, body } = postContentFactories.getPostContent1()

		PostContent.create({ title, body }, (err, doc) => {
			expect(err).to.not.exist
			expect(doc.title).to.equal(title)
			expect(doc.body).to.equal(body)
			done();
		})
	})

	it('should give back error if `title` is not specified', (done) => {
		const { body } = postContentFactories.getPostContent1()

		PostContent.create({ body }, (err, doc) => {
			expect(doc).to.not.exist
			expect(err).to.exist
			expect(err.errors.title).to.exist
			done()
		})
	})

	it('should set `_coverImage` to default object shape if that is not specified', () => {
		const postContentObj = postContentFactories.getPostContent1()

		const postContent = new PostContent(postContentObj);
		expect(postContent._coverImage.isSet).to.be.false
		expect(postContent._coverImage.path).to.be.undefined
	})
}
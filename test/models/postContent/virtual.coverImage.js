import { expect } from 'chai'
import PostContent from '../../../backend/models/postContent'
import * as postContentFactories from '../../__factories__/postContent'

export default () => {

	it('should change `_coverImage` object shape on trigger setter', () => {
		const postContent = new PostContent(
			postContentFactories.getPostContent1()
		)
		const expectedPath = '/path/to/some/directory'

		// check initial state
		expect(postContent._coverImage.isSet).to.be.false
		expect(postContent._coverImage.path).to.not.exist


		// #1. trigger setter with true value
		postContent.coverImage = expectedPath

		expect(postContent._coverImage.isSet).to.be.true
		expect(postContent._coverImage.path).to.equal(expectedPath)
	
		// #2. trigger setter with false value
		postContent.coverImage = null
		
		expect(postContent._coverImage.isSet).to.be.false
		expect(postContent._coverImage.path).to.not.exist
	})

	it('should receive correct value on trigger getter', () => {
		const postContent = new PostContent(
			postContentFactories.getPostContent1()
		)
		const expectedPath = '/path/to/some/directory'

		expect(postContent.coverImage).to.be.null
		
		postContent.coverImage = expectedPath

		expect(postContent.coverImage).to.equal(expectedPath)

		postContent.coverImage = null

		expect(postContent.coverImage).to.be.null		
	})
}
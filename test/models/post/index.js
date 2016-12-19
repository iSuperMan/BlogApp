import save from './save'
import createDraft from './createDraft'
import { expect } from 'chai'
import Post from '../../../backend/models/post'
import PostContent from '../../../backend/models/postContent'
import * as postFactories from '../../__factories__/post'
import * as postContentFactories from '../../__factories__/postContent'
import sinon from 'sinon'

export default () => {

	describe('post.save()', save);
	
	describe('post.pushContentToChangesHistory()', () => {

		it('should push item to `changesHistory` array', () => {
			const post = new Post(postFactories.getPost1())
			const postContent = new PostContent(postContentFactories.getPostContent1());
			const type = 'autosaved';

			post.pushContentToChangesHistory(postContent, type);

			expect(post.changesHistory[0].type).to.equal(type)
			expect(post.changesHistory[0]._content.toString()).to.equal(postContent.id)
		}) 
	})

	describe('post.pushAutosavedContentToChangesHistory()', () => {

		it('should call `post.pushContentToChangesHistory()` with correct arguments', sinon.test(function() {
			const post = new Post(postFactories.getPost1())
			const postContent = new PostContent(postContentFactories.getPostContent1());

			const stub = this.stub(post, 'pushContentToChangesHistory');

			post.pushAutosavedContentToChangesHistory(postContent);

			sinon.assert.calledOnce(stub)
			sinon.assert.calledWith(stub, postContent, 'autosaved')
		}))
	})

	describe('post.updateLastEditedDate()', () => {

		it('should change `lastEditedDate` prop', () => {
			const post = new Post(postFactories.getPost1())
			
			const oldValue = new Date();
			post.lastEditedDate = oldValue;
			
			post.updateLastEditedDate();

			expect(post.lastEditedDate).to.not.equal(oldValue)
		})
	})

	describe('post.createDraft()', createDraft)
}
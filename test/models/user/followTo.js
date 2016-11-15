import User from '../../../backend/models/user'
import sinon from 'sinon'

export default () => {

	it('should trigger right methods with right arguments', sinon.test(function() {
		const user1 = new User();
		const user2 = new User();

		const pushToFollowing = this.stub(user1, 'pushToFollowing')
		pushToFollowing.yields()

		const pushToFollowers = this.stub(user2, 'pushToFollowers')
		pushToFollowers.yields()

		const callback = this.spy();

		user1.followTo(user2, callback)

		sinon.assert.calledOnce(callback);
		sinon.assert.calledOnce(pushToFollowing);
		sinon.assert.calledWith(pushToFollowing, user2)
		sinon.assert.calledOnce(pushToFollowers);
		sinon.assert.calledWith(pushToFollowers, user1)
	}))	
}
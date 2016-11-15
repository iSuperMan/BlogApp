import User from '../../../backend/models/user'
import sinon from 'sinon'

export default () => {

	it('should trigger right methods with right arguments', sinon.test(function() {
		const user1 = new User();
		const user2 = new User();

		const pullFromFollowing = this.stub(user1, 'pullFromFollowing')
		pullFromFollowing.yields()

		const pullFromFollowers = this.stub(user2, 'pullFromFollowers')
		pullFromFollowers.yields()

		const callback = this.spy();

		user1.unfollowTo(user2, callback)

		sinon.assert.calledOnce(callback);
		sinon.assert.calledOnce(pullFromFollowing);
		sinon.assert.calledWith(pullFromFollowing, user2)
		sinon.assert.calledOnce(pullFromFollowers);
		sinon.assert.calledWith(pullFromFollowers, user1)
	}))	
}
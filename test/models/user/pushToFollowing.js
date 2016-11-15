import User from '../../../backend/models/user'
import { expect } from 'chai'
import * as userFactory from '../../__factories__/user'
import series from 'async/series'
import parallel from 'async/parallel'

export default () => {

	const user1 = new User(userFactory.getUser1())
	const user2 = new User(userFactory.getUser2())

	beforeEach(done => {
		series([
			cb => User.remove({}, cb),
			cb => parallel([
				cb => user1.save(cb),
				cb => user2.save(cb)
			], cb)
		], done)
	})

	it('should add user ID to following array', done => {
		series([
			cb => user1.pushToFollowing(user2, cb),
			cb => User.findById(user1.id, (err, user) => {
				expect(user.following[0].toString()).to.equal(user2.id)
				cb();
			})
		], done)
	})

}
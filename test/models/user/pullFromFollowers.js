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
			], cb),
			cb => user1.pushToFollowers(user2, cb)
		], done)
	})

	it('should remove user ID from followers array', done => {
		expect(user1.followers).to.not.be.empty
		
		series([
			cb => user1.pullFromFollowers(user2, cb),
			cb => User.findById(user1.id, (err, user) => {
				expect(user.followers).to.be.empty
				cb();
			})
		], done)
	})

}
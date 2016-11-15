import { expect } from 'chai'
import User, * as validators from '../../../backend/models/user'
import series from 'async/series'
import * as userFactory from '../../__factories__/user'

export default () => {
	afterEach(done => {
		User.remove({}, done)
	})

	describe('emailUniqueValidator', () => {
		
		it('should give back true if email is not existing', done => {
			const email = 'test1@gmail.com';

			validators.emailUniqueValidator(email, result => {
				expect(result).to.be.true
				done()
			})
		})

		it('should give back false if email is already exist', done => {
			const user = userFactory.getUser1();
			const { email } = user;

			series([
				cb => User.create(user, cb),
				cb => validators.emailUniqueValidator(email, result => {
					expect(result).to.be.false
					cb()
				})
			], done)
		})
	})

	describe('usernameUniqueValidator', () => {

		it('should give back true if username is not existing', done => {
			const username = 'some_user'

			validators.usernameUniqueValidator(username, result => {
				expect(result).to.be.true
				done()
			})
		})

		it('should give back false if username is already exist', done => {
			const user = userFactory.getUser1();
			const { username } = user;

			series([
				cb => User.create(user, cb),
				cb => validators.usernameUniqueValidator(username, result => {
					expect(result).to.be.false
					cb()
				})
			], done)
		})
	})
}
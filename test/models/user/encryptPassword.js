import User from '../../../backend/models/user'
import crypto from 'crypto'
import { expect } from 'chai'
import sinon from 'sinon'

export default () => {

	it('should encrypt password', () => {
		const password = 'password111'
		const user = new User();

		user.setSalt();

		const encryptPassword = user.encryptPassword(password)

		expect(encryptPassword).to.not.equal(password)
		expect(encryptPassword).to.match(/^[a-z0-9]{40}$/)
	})

	it('should get same encrypt results for same passwords', () => {
		const onePassword = 'password111'
		const twoPassword = 'password111'
		const user = new User();

		user.setSalt();

		const oneEncryptPassword = user.encryptPassword(onePassword)
		const twoEncryptPassword = user.encryptPassword(twoPassword)

		expect(oneEncryptPassword).to.equal(twoEncryptPassword)
	})

	it('should get different encrypt results for different passwords', () => {
		const onePassword = 'password123'
		const twoPassword = 'password321'
		const user = new User();

		user.setSalt();

		const oneEncryptPassword = user.encryptPassword(onePassword)
		const twoEncryptPassword = user.encryptPassword(twoPassword)

		expect(oneEncryptPassword).to.not.equal(twoEncryptPassword)
	})

	it('should using a salt property of user', sinon.test(function() {
		const password = 'password123'
		const user = new User()
		
		user.setSalt()

		const spy = this.spy(crypto, 'createHmac')

		user.encryptPassword(password)

		sinon.assert.calledWith(spy, 'sha1', user.salt)
	}))
}
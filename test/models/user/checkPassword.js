import { expect } from 'chai'
import User from '../../../backend/models/user'

export default () => {

	it('should return true if passwords are matching', () => {
		const password = 'password123'
		const passwordRepeat = 'password123'
		const user = new User({password})

		expect(
			user.checkPassword(passwordRepeat)
		).to.be.true
	})

	it('should return false if passwords are not matching', () => {
		const password = 'password123'
		const passwordRepeat = 'password321'
		const user = new User({password})

		expect(
			user.checkPassword(passwordRepeat)
		).to.be.false	
	})
}
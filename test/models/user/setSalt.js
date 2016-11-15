import { expect } from 'chai'
import User from '../../../backend/models/user'

export default () => {
	it('should set random value every time', () => {
		const user = new User()
		
		user.setSalt()
		const salt1 = user.salt

		user.setSalt()
		const salt2 = user.salt

		user.setSalt()
		const salt3 = user.salt

		expect(salt1).to.not.equal(salt2)
		expect(salt1).to.not.equal(salt3)
		expect(salt3).to.not.equal(salt2)
	})
}
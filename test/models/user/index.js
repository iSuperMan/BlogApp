import encryptPassword from './encryptPassword'
import setSalt from './setSalt'
import checkPassword from './checkPassword'
import save from './save'
import validators from './validators';
import User from '../../../backend/models/user'
import { expect } from 'chai'
import sinon from 'sinon'

export default () => {
	describe('user.setSalt()', setSalt)
	describe('user.encryptPassword()', encryptPassword)
	describe('user.checkPassword()', checkPassword)
	describe('custom validators', validators)
	describe('user.save()', save)

	describe('virtual field `user.password`', () => {
		it('should set `salt` and `hashedPassword` on setter', () => {
			const user = new User();

			expect(user.hashedPassword).to.be.empty // by default empty string
			expect(user.salt).to.not.exist

			user.password = 'some_password1234'

			expect(user.hashedPassword).to.not.be.empty
			expect(user.salt).to.exist
		})

		it('should return plain password on getter', () => {
			const user = new User();
			const expectedPassword = 'some_password1234';

			expect(user.password).to.be.empty

			user.password = expectedPassword;
			expect(user.password).to.equal(expectedPassword)
		})

		it('should trigger `user.setSalt()` and `user.encryptPassword()` in order on setter', sinon.test(function() {
			const user = new User();

			const setSaltSpy = this.spy(user, 'setSalt');
			const encryptPassword = this.spy(user, 'encryptPassword');

			user.password = 'some_password1234';

			sinon.assert.calledOnce(setSaltSpy);
			sinon.assert.calledOnce(encryptPassword);
			sinon.assert.callOrder(setSaltSpy, encryptPassword);
		}))
	})
}
import { expect } from 'chai'
import agent from '../../__utils__/supertestAgent'

const requestRoute = '/auth/signup'

export default () => {
	it('should get any response', done => {
		agent
			.post(requestRoute)
			.expect(200, done)
	})
}
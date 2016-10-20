import http from 'http'
import { expect } from 'chai'

import '../backend/server.js'

describe('Example test', () => {
	it('should pass', () => {
		expect('hello').to.equal('hello');
	})
})
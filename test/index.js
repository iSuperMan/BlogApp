import http from 'http'
import { expect } from 'chai'
import sinon from 'sinon'

import '../backend/server.js'
import mongoose from '../backend/libs/mongoose'

describe('Server', () => {
    it('should return 200', done => {
        http.get('http://127.0.0.1:8080', res => {
            expect(res.statusCode).to.equal(200)
            done()
        })
    })
})

describe('MongoDB', () => {
	it('should establish connection to database', () => {
		expect(mongoose.connection.readyState).to.oneOf([1, 2])
	})
})

import routes from './routes'
import models from './models'

routes()
models()
import { expect } from 'chai'
import User from '../../../backend/models/user'
import * as userFactory from '../../__factories__/user'
import series from 'async/series'
import each from 'async/each'

export default () => {

	afterEach(done => {
		User.remove({}, done)
	})

	it('should save user without error', done => {
		const expectedUser = userFactory.getUser1()
		const { email, username } = expectedUser
		
		User.create(expectedUser, (err, user) => {
			expect(err).to.not.exist
			expect(user.email).to.equal(email)
			expect(user.username).to.equal(username)
			done()
		})
	})

	it('should give back error if `email` is not specified', done => {
		const user = userFactory.getUser1();
		delete user.email;

		User.create(user, (err, user) => {
			expect(user).to.not.exist
			expect(err).to.exist
			expect(err.errors.email).to.exist
			done()
		})
	})

	it('should give back error if `email` is invalid', done => {
		const email = 'invalidEmail';
		const expectedUser = userFactory.getUser1({ email })

		User.create(expectedUser, (err, user) => {
			expect(user).to.not.exist
			expect(err).to.exist
			expect(err.errors.email).to.exist
			done()
		})
	})

	it('should give back error if `email` is already existing', done => {
		const user1 = new User(userFactory.getUser1());
		const user2 = new User(userFactory.getUser2({ email: user1.email }));

		series([
			cb => user1.save(user1, cb),
			cb => user2.save((err, user) => {
				expect(user).to.not.exist
				expect(err).to.exist
				expect(err.errors.email).to.exist
				cb()
			})
		], done)
	})

	it('should give back error if `username` is not specified', done => {
		const user = userFactory.getUser1();
		delete user.username

		User.create(user, (err, user) => {
			expect(user).to.not.exist
			expect(err).to.exist
			expect(err.errors.username).to.exist
			done()
		})
	})

	it('should give back error if `username` is already existing', done => {
		const user1 = new User(userFactory.getUser1());
		const user2 = new User(userFactory.getUser2({ username: user1.username }));

		series([
			cb => user1.save(user1, cb),
			cb => user2.save((err, user) => {
				expect(user).to.not.exist
				expect(err).to.exist
				expect(err.errors.username).to.exist
				cb()
			})
		], done)
	})

	it('should give back error if `username` length more than 20', done => {
		const username = 'andrei_andrei_andrei_'
		const user = new User(userFactory.getUser1({ username }))

		User.create(user, (err, user) => {
			expect(user).to.not.exist
			expect(err).to.exist
			expect(err.errors.username).to.exist
			done()
		})
	})

	it('should give back error if `username` length less than 5', done => {
		const username = 'user'
		const user = new User(userFactory.getUser1({ username }))

		User.create(user, (err, user) => {
			expect(user).to.not.exist
			expect(err).to.exist
			expect(err.errors.username).to.exist
			done()
		})
	})

	it('should give back error if `username` contains forbidden symbols', done => {
		const forbiddenSymbols = '!@#$%^&*()-=+?;№"\'[]:,\\|/~`'

        each(forbiddenSymbols.split(''), (forbiddenSymbol, callback) => {
        	const username = '_user' + forbiddenSymbol;
        	const user = new User(userFactory.getUser1({ username }))
        	
        	User.create(user, (err, user) => {
        		expect(user).to.not.exist
        		expect(err).to.exist
        		expect(err.errors.username).to.exist
        		callback()
        	})
        }, done)
	})

	it('should give back error if `password` length is less than 5 chars', done => {
		const password = '1234';
		const user = userFactory.getUser1({ password });

		User.create(user, (err, user) => {
			expect(user).to.not.exist
			expect(err).to.exist
			expect(err.errors.password).to.exist
			done()
		})
	})

	it('should give back error if `password` length is more than 20 chars', done => {
		const password = '0123456789_0123456789';
		const user = userFactory.getUser1({ password });

		User.create(user, (err, user) => {
			expect(user).to.not.exist
			expect(err).to.exist
			expect(err.errors.password).to.exist
			done()
		})
	})
}
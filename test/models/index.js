import user from './user'
import postContent from './postContent'
import post from './post'

export default () => describe('Models', () => {
	describe('User', user)
	describe('PostContent', postContent)
	describe('Post', post)
})
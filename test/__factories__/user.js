export const getUser1 = (customValues = null) => {
	const user = {
		email: 'user1@gmail.com',
		password: 'password_user1',
		username: 'user1'
	}

	return Object.assign(user, customValues || {})
}

export const getUser2 = (customValues = null) => {
	const user = {
		email: 'user2@gmail.com',
		password: 'password_user2',
		username: 'user2'
	}

	return Object.assign(user, customValues || {})
}
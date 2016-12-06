export const getPostContent1 = (customValues = {}) => {
	const postContent = {
		title: 'some title',
		body: 'some body'
	}

	return Object.assign(postContent, customValues)
}
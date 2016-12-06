import { Types } from 'mongoose'

export const getPost1 = ( authorId, draftContentId, customValues = {}) => {
	const post = {
		_author: authorId || Types.ObjectId(),
		_draftContent: draftContentId || Types.ObjectId()
	}

	return Object.assign(post, customValues)
}

export const getChange1 = (postContentId, customValues = {}) => {
	const change = {
		_content: postContentId || Types.ObjectId(),
		type: 'autosaved'
	}

	return Object.assign(change, customValues)
}
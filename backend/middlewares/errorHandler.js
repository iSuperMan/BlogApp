import errorhandler from 'errorhandler'
import { HttpError } from '../error'

module.exports = (err, req, res, next) => {
	if(typeof err == 'number'){
		err = new HttpError(err);
	}

	if(err instanceof HttpError){
		res.sendHttpError(err);
	} else{
		if(process.env.NODE_ENV === 'development'){
			errorhandler()(err, req, res, next); // возвращаем клиенту стэк ошибок
		} else{
			res.sendHttpError(new HttpError(500)); // возвращаем клиенту 500 ошибку
		}
	}
}
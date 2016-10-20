import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'
import appReducer from './redusers'

let middlewares = [
    thunkMiddleware,
    routerMiddleware(browserHistory)
]

if(process.env.NODE_ENV !== 'production') {
    middlewares = [ ...middlewares, createLogger()]
}

export default () => {

    return createStore(
        appReducer,
        applyMiddleware(...middlewares)
    )
}
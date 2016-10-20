import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as form } from 'redux-form'

const appReducer = combineReducers({
    routing,
    form
})

export default appReducer
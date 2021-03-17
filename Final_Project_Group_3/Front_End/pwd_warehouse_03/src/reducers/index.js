import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import productReducer from './productReducer'

const allReducers = combineReducers({
    user: userReducer,
    productReducer
})

export default allReducers

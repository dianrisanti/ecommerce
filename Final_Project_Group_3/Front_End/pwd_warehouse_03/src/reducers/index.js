import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import productReducer from './productReducer'
import profileReducer from './profileReducer'

const allReducers = combineReducers({
    user: userReducer,
    product: productReducer,
    profile: profileReducer
})

export default allReducers

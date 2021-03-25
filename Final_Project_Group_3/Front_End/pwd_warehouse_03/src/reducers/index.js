import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import productReducer from './productReducer'
import profileReducer from './profileReducer'
import adminReducer from './adminReducer'

const allReducers = combineReducers({
    user: userReducer,
    product: productReducer,
    profile: profileReducer,
    admin: adminReducer

})

export default allReducers

import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import productReducer from './productReducer'
import cartReducer from './cartReducer'
import profileReducer from './profileReducer'

const allReducers = combineReducers({
    user: userReducer,
    product: productReducer,
    profile: profileReducer,
    cartReducer
})

export default allReducers

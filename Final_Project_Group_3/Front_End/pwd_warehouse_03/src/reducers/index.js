import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import productReducer from './productReducer'
import profileReducer from './profileReducer'
import cartReducer from './cartReducer'

const allReducers = combineReducers({
    user: userReducer,
    product: productReducer,
    profile: profileReducer,
    // cartReducer

})

export default allReducers

import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import productReducer from './productReducer'
import cartReducer from './cartReducer'

const allReducers = combineReducers({
    user: userReducer,
    productReducer,
    cartReducer
})

export default allReducers

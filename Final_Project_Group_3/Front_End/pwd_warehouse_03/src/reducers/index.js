import { combineReducers } from 'redux'

import { userReducer } from './userReducer'
import productReducer from './productReducer'
import profileReducer from './profileReducer'
import orderReducer from './orderReducer.jsx'

const allReducers = combineReducers({
    user: userReducer,
    product: productReducer,
    profile: profileReducer,
    order: orderReducer
})

export default allReducers

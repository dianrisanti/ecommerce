const INITIAL_STATE = {
    products: []
}

const adminReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'GET_PRODUCT': 
            return {
                ...state,
                products: action.payload
            }
        default:
            return state
    }
}

export default adminReducer
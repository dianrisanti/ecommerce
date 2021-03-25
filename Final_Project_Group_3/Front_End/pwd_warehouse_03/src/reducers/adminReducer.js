const INITIAL_STATE = {
    productStock: [],
    products: []
}

const adminReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'GET_PRODUCT': 
            return {
                ...state,
                products: action.payload
            }
        case 'GET_PRODUCT_STOCK': 
            return {
                ...state,
                productStock: action.payload
            }
        default:
            return state
    }
}

export default adminReducer
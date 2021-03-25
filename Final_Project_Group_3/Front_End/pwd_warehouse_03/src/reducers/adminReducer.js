const INITIAL_STATE = {
    productStock: []
}

const productReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'GET_PRODUCT_STOCK': 
            return {
                ...state,
                productStock: action.payload
            }
        
        default:
            return state
    }
}

export default productReducer
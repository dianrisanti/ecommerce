import { CHECK_OUT } from '../actions/helper';

const INITIAL_STATE = {
    cart: [],
    loading: false,
    total: null,
    order_number: null,
};

const cartReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHECK_OUT:
            return {
                ...state,
                cart: action.payload.cart,
                total: null,
            };
        default:
            return state;
    }
};

export default cartReducer;
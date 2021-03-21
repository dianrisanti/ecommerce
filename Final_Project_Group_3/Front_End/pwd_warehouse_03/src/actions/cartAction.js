import Axios from 'axios';
import { GET_CART, CHECK_OUT } from './helper';

// edit qty in user's cart
export const EditCartQtyAction = (input, id) => {
    return async (dispatch) => {
        try {
            // request api : EDIT
            const res = await Axios.patch('http://localhost:2000/cart/edit', input);
            console.log(res.data);
            console.log(input);

            // request api get cart data
            const cart = await Axios.get(`http://localhost:2000/cart/get/${parseInt(id)}`);
            dispatch({ type: GET_CART, payload: cart.data });
        } catch (err) {
            console.log(err.response ? err.response.data : err);
        }
    };
};

// delete user's cart item
export const DeleteCartItemAction = (input, id) => {
    return async (dispatch) => {
        try {
            // request api : DELETE
            const res = await Axios.post('http://localhost:2000/cart/delete', input);
            console.log(res.data)
            console.log(input);

            // request api get cart data
            const cart = await Axios.get(`http://localhost:2000/cart/get/${parseInt(id)}`);
            dispatch({ type: GET_CART, payload: cart.data });
        } catch (err) {
            console.log(err.response ? err.response.data : err);
        }
    };
};

// checkout
export const ChekOutAction = (user_id, order_number) => {
    return async (dispatch) => {
        try {

            // request API : check out
            const res = await Axios.get(
                URL + '/api/order/checkout/' + order_number,
            );
            console.log(res.data);

            // request api get cart data
            const cart = await Axios.get(URL + '/api/order/cart/' + user_id);
            dispatch({ type: CHECK_OUT, payload: cart.data });
        } catch (err) {
            console.log(err.response ? err.response.data : err);
        }
    };
}
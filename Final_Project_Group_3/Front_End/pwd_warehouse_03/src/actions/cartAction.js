import Axios from 'axios';
import { GET_CART} from './helper';

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
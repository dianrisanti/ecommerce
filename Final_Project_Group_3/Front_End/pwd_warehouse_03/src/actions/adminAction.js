import Axios from 'axios'

export const getProductStock = () => {
    return async(dispatch) => {
        try{
            const res = await Axios.get('http://localhost:2000/admin/getstock')
            dispatch({ type: 'GET_PRODUCT_STOCK', payload: res.data })
        }
        catch(err){
            console.log(err)
        }
    }
}

export const getProduct = () => {
    return async(dispatch) => {
        try{
            const res = await Axios.get('http://localhost:2000/admin/getall')

            dispatch({
                type: 'GET_PRODUCT',
                payload: res.data
            })
        }
        catch(err){
            console.log(err)
        }
    }
}
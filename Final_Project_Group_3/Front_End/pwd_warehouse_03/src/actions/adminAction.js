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

export const confirmPayment = (data) => {
    return async(dispatch) => {
        try{
            let status = {status: 4}
            const res = await Axios.post(`http://localhost:2000/admin/confirmPayment/${data}`, status)
            console.log(res.data)

            dispatch({
                type: 'SET_PAYMENT_STATUS',
                payload: res.data
            })
        }
        catch(err){
            console.log(err)
        }
    }
}

export const cancelOrder = (data) => {
    return async(dispatch) => {
        try{
            let status = {status: 5}
            const res = await Axios.post(`http://localhost:2000/admin/confirmPayment/${data}`, status)
            console.log(res.data)

            dispatch({
                type: 'SET_PAYMENT_STATUS',
                payload: res.data
            })
        }
        catch(err){
            console.log(err)
        }
    }
}
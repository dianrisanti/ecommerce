import Axios from 'axios';

const api = Axios.create({ baseURL: 'http://localhost:2000/cart' })

export const addToCart = async (data, action) => {
    try {
        await api.post(`/add`, data)
        action()
    } catch (error) {
        console.log(error.response?.data)
    }
}
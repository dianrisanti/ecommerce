let INITIAL_STATE = {
    id_user: null,
    username: '',
    password: '',
    email: '',
    location: '',
    address: '',
    regStatus: null,
    cart: []
    
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                id_user: action.payload.id_user,
                username: action.payload.username,
                password: action.payload.password,
                email: action.payload.email,
                location: action.payload.location,
                address: action.payload.address,
                regStatus: action.payload.status,
                cart: action.payload.cart
            }
        case 'LOG_OUT':
            return INITIAL_STATE
        case 'VERIFICATION':
            return{
                ...state,
                regStatus: 1
            }
        case 'LOGIN_ERR':
            return {
                ...state,
                errLogin: action.payload
            }
        default:
            return state
    }
}
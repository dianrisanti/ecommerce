let INITIAL_STATE = {
    id_user: null,
    username: '',
    email: '',
    location: '',
    address: '',
    regStatus: null,
    order_number: ''
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                id_user: action.payload.id,
                username: action.payload.username,
                email: action.payload.email,
                location: action.payload.location,
                address: action.payload.address,
                regStatus: action.payload.status,
                order_number: action.payload.order_number
            }
        case 'LOG_OUT':
            return INITIAL_STATE
        case 'VERIFICATION':
            return {
                ...state,
                regStatus: 1
            }
        case 'LOGIN_ERR':
            return {
                ...state,
                errLogin: action.payload
            }
        case 'PAYMENTCONFIRMATION':
            return {
                ...state,
                order_number: action.payload
            }
        default:
            return state
    }
}
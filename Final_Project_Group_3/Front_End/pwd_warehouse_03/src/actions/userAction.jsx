import Axios from 'axios'
import { LOG_IN, LOG_OUT } from './helper'

export let login = (data) => {
    return {
        type: LOG_IN,
        payload: data
    }
}

export let logout = () => {
    return {
        type: LOG_OUT
    }
}

export const verification = () => {
    return {
        type: 'VERIFICATION'
    }
}
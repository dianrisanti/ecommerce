// const cryptojs = require('crypto-js')
// const SECRET_KEY = process.env.CRYPTO_KEY
const util = require('util')
const database = require('../database')

module.exports = {
    generateQuery: (body) => {
        let result = ''
        for (let property in body) {
            result += ` ${property} = ${database.escape(body[property])},`
        }
        return result.slice(0, -1)
    },
    // generateQuery: (input) => {
    //     let result = ''
    //     for(let key in input){
    //         if(key === 'password') {
    //             result += ` ${key} = '${cryptojs.HmacMD5(input[key], SECRET_KEY).toString()}',`
    //         } else {
    //             result += ` ${key} = ${database.escape(input[key])},`
    //         }
    //     }
    //     return result.slice(0, -1)
    // },
    asyncQuery: util.promisify(database.query).bind(database)
}
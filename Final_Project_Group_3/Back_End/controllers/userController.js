// import module yang dibutuhkan
const { validationResult, check } = require('express-validator')
const cryptojs = require('crypto-js')
const handlebars = require('handlebars')
const fs = require('fs')

// import helpers
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')
const { createToken, createTokenExp } = require('../helpers/jwt')
const transporter = require('../helpers/nodemailer')

// import database connection
const db = require('../database')

// import dotenv
const SECRET_KEY = process.env.CRYPTO_KEY

// export controller
module.exports = {
    getAllUser: async(req, res) => {
        try{
            const userQuery = 'SELECT * FROM users WHERE role = 2'
            const allUsers = await asyncQuery(userQuery)
            res.status(200).send(allUsers)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
    
    login: (req, res) => {
        const { username, password, email } = req.body

        const QUERY = email ? `u.email = '${email}'` : `u.username = '${username}'`

        // hashing password
        const hashpass = cryptojs.HmacMD5(password, SECRET_KEY)


        const loginQuery = `SELECT u.id, u.username, u.email, u.status, u.role, ul.province_name location, p.address FROM users u 
        JOIN profile p ON u.id = p.id_user
        LEFT JOIN user_location ul ON p.location_id = ul.id WHERE ` + QUERY +
        `AND u.password=${db.escape(hashpass.toString())}`
        // console.log(loginQuery)

        db.query(loginQuery, (err, result) => {
            if (err) return res.status(500).send(err)

            if (result.length === 0) return res.status(400).send('Username or Password is wrong')

            let token = createToken({ id: result[0].id, username: result[0].username })

            result[0].token = token

            res.status(200).send(result[0])
        })
    },

    register: async (req, res) => {
        const { username, password, email } = req.body

        // validation input from user
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)

        const hashpass = cryptojs.HmacMD5(password, SECRET_KEY)

        try {
            const checkUser = `SELECT * FROM users 
                              WHERE username=${db.escape(username)}
                              OR email=${db.escape(email)}`
            const resCheck = await asyncQuery(checkUser)

            if (resCheck.length !== 0) return res.status(400).send('Username or Email is already exist')

            const regQuery = `INSERT INTO users (username, password, email)
                              VALUES (${db.escape(username)}, ${db.escape(hashpass.toString())}, ${db.escape(email)})`
            const resRegister = await asyncQuery(regQuery)

            const profileQuery = `INSERT INTO profile (id_user) values (${resRegister.insertId})`
            const resProfile = await asyncQuery(profileQuery)

            // create token
            const token = createToken({ id: resRegister.insertId, username: username })

            // send email notification to user
            const option = {
                from: `admin <cusunliem@gmail.com>`,
                to: `${email}`,
                subject: 'EMAIL VERIFICATION',
                text: '',
            }

            //set up handlebars
            const emailFile = fs.readFileSync('./email/index.html').toString()
            // console.log(email)

            // compile data email
            const template = handlebars.compile(emailFile)

            // menambah properti html di dalam option 
            option.html = template({ token: token, name: username })

            // send email
            const info = await transporter.sendMail(option)

            res.status(200).send(info.response)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body

        try {
            const checkUser = `SELECT * FROM users 
                              WHERE email=${db.escape(email)}`
            const resCheck = await asyncQuery(checkUser)

            if (resCheck.length === 0) return res.status(400).send('Email not yet registered')
            if (parseInt(resCheck[0].status) === 0) return res.status(400).send(`Account with username ${resCheck[0].username} has not been verified, please check your email. Request new password can not be proceed until the account verified`)

            // create token
            const token = createTokenExp({ id: resCheck[0].id, username: resCheck[0].username })

            // send email notification to user
            const option = {
                from: `admin <cusunliem@gmail.com>`,
                to: `${email}`,
                subject: 'NEW PASSWORD REQUEST',
                text: '',
            }

            //set up handlebars
            const emailFile = fs.readFileSync('./email/forgotPassword.html').toString()
            // console.log(email)

            // compile data email
            const template = handlebars.compile(emailFile)

            // menambah properti html di dalam option 
            option.html = template({ token: token, name: resCheck[0].username })

            // send email
            const info = await transporter.sendMail(option)

            res.status(200).send(info.response)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    verifyForgotPass : async(req, res) => {
        try{
            res.status(200).send(req.user)
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },

    edit: (req, res) => {
        const id = parseInt(req.params.id)

        // validation input from user
        const errors = validationResult(req)

        const errUsername = errors.errors.filter(item => item.param === 'username' && item.value !== undefined)
        if (errUsername.length !== 0) return res.status(400).send(errUsername[0].msg)

        const errEmail = errors.errors.filter(item => item.param === 'email' && item.value !== undefined)
        if (errEmail.length !== 0) return res.status(400).send(errEmail[0].msg)


        const checkUser = `SELECT * FROM users WHERE id=${db.escape(id)}`
        // console.log(checkUser)

        db.query(checkUser, (err, result) => {
            if (err) return res.status(500).send(err)

            // if id not found
            if (result.length === 0) return res.status(200).send(`User with id : ${id} is not found`)

            const editUser = `UPDATE users SET${generateQuery(req.body)} WHERE id=${id}`
            // console.log(editUser)
            db.query(editUser, (err2, result2) => {
                if (err2) return res.status(500).send(err2)

                res.status(200).send(result2)
            })
        })
    },

    editPass: (req, res) => {
        const id = parseInt(req.params.id)

        // validation input from user
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)

        const checkUser = `SELECT * FROM users WHERE id=${db.escape(id)}`
        // console.log(checkUser)

        db.query(checkUser, (err, result) => {
            if (err) return res.status(500).send(err)

            // if id not found
            if (result.length === 0) return res.status(200).send(`User with id : ${id} is not found`)
            if (parseInt(result[0].status) === 0) return res.status(200).send(`Your account has not been verified`)

            const hashpass = cryptojs.HmacMD5(req.body.password, SECRET_KEY)

            // query change password
            const editPassword = `UPDATE users SET password=${db.escape(hashpass.toString())} WHERE id=${id}`
            // console.log(editPassword)

            db.query(editPassword, (err2, result2) => {
                if (err2) return res.status(500).send(err2)

                res.status(200).send(result2)
            })
        })
    },

    emailVerification: async (req, res) => {
        try {
            // query to update status to verified
            const verify = `UPDATE users SET status = 1 
                            WHERE id = ${req.user.id} AND username = ${db.escape(req.user.username)}`
            const result = await asyncQuery(verify)

            res.status(200).send('Email has been verified', result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    keepLogin: async (req, res) => {
        try {
            // query to get data from database
            const getUser = `SELECT u.id, u.username, u.email, u.status, u.role, ul.province_name location, p.address FROM users u 
            JOIN profile p ON u.id = p.id_user
            LEFT JOIN user_location ul ON p.location_id = ul.id
            WHERE u.username='${req.user.username}'`

            const result = await asyncQuery(getUser)
            // console.log('result dari query', result[0])

            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    uploadPayment: async (req, res) => {
        const order_number = req.params.order_number

        if (!req.file) return res.status(400).send('NO IMAGE')

        try {
            const updatePict = `UPDATE orders SET payment_confirmation = 'images/${req.file.filename}', status = 3 
                                WHERE order_number = ${db.escape(order_number)}`
            const result = await asyncQuery(updatePict)

            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },

    getPaymentConfirmation: async (req, res) => {
        const order_number = req.params.order_number
        try {
            const queryPaymentConf = `SELECT o.* , sum(x.total) total FROM orders o 
                                    JOIN order_details x ON o.order_number = x.order_number
                                    WHERE o.order_number=${db.escape(order_number)}
                                    GROUP BY o.order_number`
            const result = await asyncQuery(queryPaymentConf)
            
            const currencyFractionDigits = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'IDR',
            }).resolvedOptions().maximumFractionDigits;
            
            var value = result[0].total.toLocaleString('de-DE', { maximumFractionDigits: currencyFractionDigits });
            
            const total_IDR = ("IDR " + value)
            result[0].total_IDR = total_IDR

            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}
const jwt = require('jsonwebtoken')
const TOKEN_KEY = process.env.CRYPTO_KEY

module.exports = {
    createToken: (data) => {
        return jwt.sign(data, TOKEN_KEY)
    },

    createTokenExp : (data) => {
        return jwt.sign(data, TOKEN_KEY, { expiresIn: 60 })
    },

    verifyToken: (req, res, next) => {
        const token = req.body.token

        //check if token exist
        if(!token) return res.status(400).send('no token')

        try {
            // verify token
            const result = jwt.verify(token, TOKEN_KEY)

            // add token to req.user
            req.user = result

            // lanjut ke proses berikutnya
            next()
        }
        catch(err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}
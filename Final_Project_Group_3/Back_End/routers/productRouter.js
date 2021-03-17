const router = require('express').Router()

const { productController } = require('../controllers')

router.get('/all', productController.getProd)

module.exports = router
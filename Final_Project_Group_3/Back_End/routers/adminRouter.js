const router = require('express').Router()

const adminController = require('../controllers/adminController')

router.get('/getstock', adminController.getProductStock)

module.exports = router
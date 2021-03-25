const router = require('express').Router()

const adminController = require('../controllers/adminController')

router.get('/getstock', adminController.getProductStock)
router.post('/editstock', adminController.editProductStock)

module.exports = router
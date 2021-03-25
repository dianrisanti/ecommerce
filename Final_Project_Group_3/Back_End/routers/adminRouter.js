const router = require('express').Router()

const adminController = require('../controllers/adminController')

router.get('/getstock', adminController.getProductStock)
router.post('/editstock', adminController.editProductStock)
router.get('/getall', adminController.getAll)
router.get('/getjakarta', adminController.getJakarta)
router.get('/getmedan', adminController.getMedan)
router.get('/getsurabaya', adminController.getSurabaya)

module.exports = router
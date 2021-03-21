const router = require('express').Router()

const orderController = require('../controllers/orderController')

router.post('/add', orderController.addCart)
router.get('/get/:id', orderController.getCart)
router.patch('/edit', orderController.editCart)
router.post('/delete', orderController.deleteCart)

module.exports = router